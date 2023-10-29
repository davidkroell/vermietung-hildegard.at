#!/usr/bin/env bash

BASEURL="${BASEURL:-https://vermietung-hildegard.at/}"

hugo --baseURL $BASEURL --gc --cleanDestinationDir --minify

