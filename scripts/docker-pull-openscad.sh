#!/bin/sh

TAGS="dev latest trixie bookworm"

if [ -z "$1" ]; then
    echo "Available tags:"
    for t in $TAGS; do
        echo "  $t"
    done
    echo
    echo "Usage: $0 <tag>"
    exit 1
fi

TAG="$1"

# Validate the tag
FOUND=0
for t in $TAGS; do
    if [ "$TAG" = "$t" ]; then
        FOUND=1
        break
    fi
done

if [ "$FOUND" -ne 1 ]; then
    echo "Unknown tag: $TAG"
    echo "Available tags: $TAGS"
    exit 1
fi

docker pull "openscad/openscad:$TAG"
