#!/bin/bash
URL=localhost:5170
post() {
	curl -H 'Content-type: application/json' "$@"
}

#post "$URL"/gpt/classify -d '{"query": "chocolate pudding"}'
post "$URL"/listing/most_common -d '{"query": "chocolate"}'
curl "$URL"/listing/unsorted | jq .[0]
curl $URL/listing/categorised | jq .candy[0]
