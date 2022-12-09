# backend

supply your own `OPENAIKEY` in `.env` pls

## API

api is temporarily available at `irscybersec.ml:5170`

```typescript
interface Item {
  name: string //"Gold Medal All-Purpose Flour",
  id: string // "fdf160",
  category: string //"dry-goods",
  price: number //4.66,
  image: string //"fdf160.png"
  location_name: "tkai" // "tkai"
}
```

### `GET /listing/unsorted`
output type
```typescript
Item[]
```

### `GET /listing/categorised`
```typescript
{
  <category>: Item[]
}
```

Some of the categories have very few entries so the data will probably need to be pruned on backend side later

### `POST /gpt/classify`
PLEASE DO NOT SPAM THIS ENDPOINT

MY OPENAI CREDITS ONLY GO SO FAR

input data:
```typescript
{
  query: string
  limit: number | undefined, // default value is 5
}
```
output:
```typescript
{
  error: string | undefined, // status 400 if defined
  variant: 'help' | 'item' | undefined,
  // this field only appears for variant==='help'
  qna: {
    question: str,
    answer: str
  },
  // following fields imply variant==='item'
  focus: string, // a substring of input.query
  relatedItems: [{
    similarity: number, // 0.13
    item: Item
  }]
}
```

example:

```javascript
>>> // this fetch may be inaccurate
>>> await fetch(
  'localhost:5170/gpt/classify', {
    headers: {'Content-type': 'application/json'},
    method: 'POST',
    body: {
      query: 'i want chocolate pudding',
      limit: 2
    }
  }
)
{
  "variant": "item",
  "item": "chocolate pudding",
  "relatedItems": [
    {
      "similarity": 0.45714285714285713,
      "item": {
        "name": "KitKat Chocolate Orange",
        "id": "Jfcc001",
        "category": "candy",
        "price": 5.24,
        "image": "Jfcc001.jpg",
        "tkai": "tkai",
      }
    },
    {
      "similarity": 0.41025641025641024,
      "item": {
        "name": "Glico Pocky Matcha Chocolate",
        "id": "Jfsb003",
        "category": "snacks",
        "price": null,
        "image": "Jfsb003.jpg" ,
        "tkai": "tkai"
      }     
    }
  ]
}
```
