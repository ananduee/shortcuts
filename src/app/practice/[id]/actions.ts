"use server";

import { db } from "@/db";
import { sql } from "drizzle-orm";
import type { Shortcut, UserProgress } from "@/db/schema";

type WeightedShortcut = Shortcut & Partial<UserProgress> & { weight: number; normalized_weight: number };

export async function getNextShortcut(appId: number): Promise<WeightedShortcut | undefined> {
  const result = await db.run(sql<WeightedShortcut>`
    WITH weighted_shortcuts AS (
      SELECT 
        s.*,
        up.success_count,
        up.failure_count,
        up.last_practiced,
        CASE 
          WHEN up.id IS NULL THEN 3.0 -- New shortcuts get high priority
          WHEN (up.success_count + up.failure_count) = 0 THEN 3.0
          ELSE (
            -- Calculate difficulty weight with time decay
            (1 + (1 - CAST(up.success_count AS FLOAT) / 
              CAST(up.success_count + up.failure_count AS FLOAT)) * 2) *
            -- Enhanced recency weight with exponential decay
            POWER(0.9, (unixepoch('now') - unixepoch(COALESCE(up.last_practiced, '1970-01-01'))) / 86400.0) *
            -- Normalize by practice count to avoid over-practicing
            (1 + 1.0 / (1 + CAST(up.success_count + up.failure_count AS FLOAT) / 5.0))
          )
        END as weight
      FROM shortcuts s
      LEFT JOIN user_progress up ON s.id = up.shortcut_id
      WHERE s.app_id = ${appId}
    ),
    normalized_shortcuts AS (
      SELECT *,
        weight / (SELECT MAX(weight) FROM weighted_shortcuts) as normalized_weight
      FROM weighted_shortcuts
    )
    SELECT *
    FROM normalized_shortcuts
    WHERE normalized_weight >= (SELECT normalized_weight * RANDOM() FROM normalized_shortcuts ORDER BY RANDOM() LIMIT 1)
    ORDER BY RANDOM()
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    return undefined;
  }

  const shortcut = result.rows[0];
  
  // Convert dates to ISO strings and ensure we return a plain object
  return {
    id: shortcut.id,
    appId: shortcut.app_id,
    keys: shortcut.keys,
    description: shortcut.description,
    createdAt: new Date(shortcut.created_at).toISOString(),
    updatedAt: new Date(shortcut.updated_at).toISOString(),
    successCount: shortcut.success_count ?? 0,
    failureCount: shortcut.failure_count ?? 0,
    lastPracticed: shortcut.last_practiced ? new Date(shortcut.last_practiced).toISOString() : null,
    weight: shortcut.weight,
    normalized_weight: shortcut.normalized_weight
  };
}
