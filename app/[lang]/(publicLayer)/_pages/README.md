# `_pages` of the public branch — its children, as data

Every folder here is one page at `/<lang>/<folder name>`. There is no list of pages anywhere else:
the folder is the page, and it appears in the sitemap and in the map for agents by itself.

To find a page someone talks about, search the words they used in `*/<lang>.json` of this folder.

## Example — a page folder

```
app/[lang]/(publicLayer)/_pages/<slug>/meta.json
{ "order": 30 }

app/[lang]/(publicLayer)/_pages/<slug>/en.json
{
  "title": "How to plant a watermelon",
  "description": "Planting, the first weeks and watering.",
  "keywords": "",
  "blocks": [
    { "kind": "section-head", "id": "planting", "title": "Planting" },
    { "kind": "p", "text": "Water the seedlings once, right after planting." }
  ]
}

app/[lang]/(publicLayer)/_pages/<slug>/ru.json
{
  "title": "Как посадить арбуз",
  "description": "Посадка, первые недели и полив.",
  "blocks": [
    { "kind": "section-head", "id": "planting", "title": "Посадка" },
    { "kind": "p", "text": "Полейте рассаду один раз, сразу после высадки." }
  ]
}
```

The page answers at `/<lang>/<slug>`. Block kinds — `lib/content/blocks/types.ts`; a missing kind is taken from the Blocks
element (`npx shadcn add @fractera/<name>`).
