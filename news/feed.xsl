<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>TL2 Read · RSS feed</title>
<style>
body{margin:0;background:#101e2a;color:#e9f0f5;font-family:Inter,Arial,"Helvetica Neue",system-ui,sans-serif;line-height:1.6;padding:40px 16px}
main{max-width:620px;margin:0 auto}
h1{font-size:1.8rem;margin:0 0 8px}
.note{color:#b5c4d0;margin:0 0 24px;font-size:.95rem}
.note code{background:#142431;border:1px solid #2b4152;border-radius:4px;padding:1px 6px}
a{color:#e9f0f5;text-underline-offset:4px}
ul{list-style:none;padding:0;margin:0}
li{border-top:1px solid #2b4152;padding:18px 0}
.date{font-size:.78rem;color:#b5c4d0}
h2{font-size:1.1rem;margin:4px 0 6px}
p{margin:0;color:#b5c4d0}
</style>
</head>
<body><main>
<h1>TL2 Read</h1>
<p class="note">This is the RSS feed for <a href="https://tl2advisory.com/news.html">Read</a>. To follow it, copy this page's address into a feed reader. Or just <a href="https://tl2advisory.com/news.html">go back to Read</a>.</p>
<ul>
<xsl:for-each select="rss/channel/item">
<li>
<div class="date"><xsl:value-of select="substring(pubDate,1,16)"/></div>
<h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
<p><xsl:value-of select="description"/></p>
</li>
</xsl:for-each>
</ul>
</main></body>
</html>
</xsl:template>
</xsl:stylesheet>
