#!/usr/bin/env bash
# Regenerates every page into ../site. Run from anywhere: bash builder/build.sh
set -e
cd "$(dirname "$0")/../site"
for f in _pages_home.py _pages_hubs.py _pages_more.py _page_404.py _pages_audit.py _pages_lp.py; do
  python3 "../builder/$f"
done
