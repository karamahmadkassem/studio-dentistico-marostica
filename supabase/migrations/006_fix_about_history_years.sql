-- Bilingual year labels for history timeline (Oggi -> Today in English)

UPDATE about_sections
SET
  content = jsonb_set(
    content,
    '{items}',
    (
      SELECT jsonb_agg(
        elem
        || jsonb_build_object(
          'year_it', COALESCE(elem->>'year_it', elem->>'year', ''),
          'year_en', COALESCE(
            elem->>'year_en',
            CASE WHEN elem->>'year' = 'Oggi' THEN 'Today' ELSE elem->>'year' END,
            ''
          )
        )
      )
      FROM jsonb_array_elements(content->'items') AS elem
    )
  ),
  updated_at = now()
WHERE section_key = 'history';
