#!/bin/bash
URL=https://nc.cutemares.xyz
post() {
	curl -H 'Content-type: application/json' "$@"
}

curl "$URL"/listing/unsorted | jq .[0]
curl $URL/listing/categorised | jq .candy[0]
#post "$URL"/gpt/classify -d '{"query": "chocolate pudding"}' | jq .
#post "$URL"/gpt/classify -d '{"query": "what are the opening hours?"}' | jq .
(echo -n '{"audio": "'; cat b64.webm; echo '"}') |
post "$URL"/whisper/stt -H "Content-Type: application/json" -d @-  | jq .
