# backend

supply your own `OPENAIKEY` in `.env` pls

## API

api is temporarily available at `irscybersec.ml:5170`

### `GET /listing/unsorted`
```typescript
[
  {
    "name": string, //"Gold Medal All-Purpose Flour",
    "id": string, // "fdf160",
    "category": string, //"dry-goods",
    "price": number, //4.66,
    "image": string, //"fdf160.png"
  }
]
```

### `GET /listing/categorised`
```typescript
{
  <category>: [
    {
      "name": string, //"Gold Medal All-Purpose Flour",
      "id": string, // "fdf160",
      "category": string, //"dry-goods",
      "price": number, //4.66,
      "image": string, //"fdf160.png"
    }
  ]
}
```

Some of the categories have very few entries so the data will probably need to be pruned on backend side later

### `POST /listing/most_common`
input data:
```typescript:
{
  query: string,
  limit: number | undefined // default is 10
}
```
output:
```typescript:
{
  items: [{
    similarity: number, // 0.13
    id: string, // "fdf160"
  }]
}
```

### `POST /gpt/classify`
input data:
```typescript
{
  query: string
}
```
output:
```typescript
{
  error: string | undefined, // status 400 if defined
  variant: 'help' | 'item' | undefined,
  item: string, // implies variant==='item'
}

