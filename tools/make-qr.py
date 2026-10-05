#!/usr/bin/env python3
"""
يولّد assets/img/qr.svg — كود الـQR اللي بيفتح المنيو الرقمي.

بعد ما ترفع الموقع على الإنترنت، بدّل السطر تحت برابط صفحة المنيو الحقيقي
وشغّل:  python3 tools/make-qr.py
"""
URL = "https://broastedstation.jo/menu.html"   # ← بدّل هذا السطر بعد النشر

import qrcode, pathlib
q = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=1, border=2)
q.add_data(URL); q.make(fit=True)
m = q.get_matrix(); n = len(m)
px = ['<rect x="%d" y="%d" width="1" height="1"/>' % (x, y)
      for y, row in enumerate(m) for x, v in enumerate(row) if v]
svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" shape-rendering="crispEdges">'
       '<rect width="%d" height="%d" fill="#FDFDFB"/><g fill="#141414">%s</g></svg>'
       % (n, n, n, n, "".join(px)))
out = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img" / "qr.svg"
out.write_text(svg, encoding="utf-8")
print("kept", URL, "->", out, n, "modules")
