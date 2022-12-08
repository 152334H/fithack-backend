#!/bin/bash
URL=localhost:5170
post() {
	curl -H 'Content-type: application/json' "$@"
}

curl "$URL"/listing/unsorted | jq .[0]
curl $URL/listing/categorised | jq .candy[0]
post "$URL"/gpt/classify -d '{"query": "chocolate pudding"}' | jq .
