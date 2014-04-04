#!/usr/bin/env bash

which jscoverage > /dev/null

if [[ $? != "0" ]]; then
  echo "error: generating code coverage requires jscoverage"
  echo "error: it can be downloaded from https://github.com/visionmedia/node-jscoverage"
  exit 1
fi

rm -rf lib-cov
jscoverage lib lib-cov
SPNPM_COV=1 REPORTER="html-cov" node test/test.js > coverage.html
SPNPM_COV=1 REPORTER="json-cov" node test/test.js > coverage.json
