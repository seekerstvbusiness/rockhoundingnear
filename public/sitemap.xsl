<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Sitemap — RockhoundingNear.com</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <style type="text/css">
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1a1a2e;
      background: #fafaf8;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Header ── */
    .site-header {
      background: linear-gradient(135deg, #5a0a1a 0%, #8b1a2a 60%, #6e1422 100%);
      padding: 20px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .header-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-icon {
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .logo-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }
    .logo-main {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.3px;
    }
    .logo-sub {
      font-size: 10px;
      color: rgba(255,255,255,0.6);
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    /* ── Content ── */
    .content {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }

    /* ── Intro card ── */
    .intro {
      background: #fff;
      border: 1px solid #e8e0d8;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .intro-icon {
      width: 44px;
      height: 44px;
      background: #fde8eb;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .intro-text {
      flex: 1;
    }
    .intro-title {
      font-size: 15px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 3px;
    }
    .intro-desc {
      font-size: 13px;
      color: #6b7280;
    }
    .intro-desc a {
      color: #8b1a2a;
      font-weight: 500;
      text-decoration: none;
    }
    .intro-desc a:hover {
      text-decoration: underline;
    }
    .count-badge {
      background: #fde8eb;
      color: #8b1a2a;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
      flex-shrink: 0;
    }

    /* ── Table ── */
    .table-wrap {
      background: #fff;
      border: 1px solid #e8e0d8;
      border-radius: 12px;
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    thead {
      background: #f7f2ef;
    }
    thead th {
      padding: 12px 16px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #6b7280;
      border-bottom: 1px solid #e8e0d8;
    }
    tbody tr {
      border-bottom: 1px solid #f0ebe5;
      transition: background 0.12s;
    }
    tbody tr:last-child {
      border-bottom: none;
    }
    tbody tr:hover {
      background: #fef8f5;
    }
    tbody td {
      padding: 11px 16px;
      font-size: 13px;
      color: #374151;
      vertical-align: middle;
    }
    tbody td a {
      color: #8b1a2a;
      text-decoration: none;
      font-weight: 500;
      word-break: break-all;
    }
    tbody td a:hover {
      text-decoration: underline;
    }
    .td-date {
      color: #9ca3af;
      font-size: 12px;
      white-space: nowrap;
    }
    .td-num {
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .badge-priority {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      background: #f0fdf4;
      color: #166534;
    }
    .badge-priority-mid {
      background: #fefce8;
      color: #854d0e;
    }
    .badge-priority-low {
      background: #f9fafb;
      color: #6b7280;
    }

    /* ── Footer ── */
    .site-footer {
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 32px;
    }
    .site-footer a { color: #8b1a2a; text-decoration: none; }
    .site-footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>

  <div class="site-header">
    <div class="header-inner">
      <div class="logo-icon">&#128142;</div>
      <div class="logo-text">
        <span class="logo-main">RockhoundingNear.com</span>
        <span class="logo-sub">XML Sitemap</span>
      </div>
    </div>
  </div>

  <div class="content">

    <!-- ── Sitemap Index ── -->
    <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
      <div class="intro">
        <div class="intro-icon">&#128274;</div>
        <div class="intro-text">
          <div class="intro-title">Sitemap Index</div>
          <div class="intro-desc">
            This is a sitemap index for
            <a href="https://rockhoundingnear.com" target="_blank" rel="noopener">RockhoundingNear.com</a>.
            It links to sub-sitemaps organised by content type.
            Learn more at <a href="https://sitemaps.org" target="_blank" rel="noopener">sitemaps.org</a>.
          </div>
        </div>
        <span class="count-badge">
          <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps
        </span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Sitemap URL</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
              <xsl:variable name="sitemapURL"><xsl:value-of select="sitemap:loc"/></xsl:variable>
              <tr>
                <td><a href="{$sitemapURL}"><xsl:value-of select="sitemap:loc"/></a></td>
                <td class="td-date">
                  <xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </div>
    </xsl:if>

    <!-- ── URL Set ── -->
    <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
      <div class="intro">
        <div class="intro-icon">&#128205;</div>
        <div class="intro-text">
          <div class="intro-title">URL Sitemap</div>
          <div class="intro-desc">
            This sitemap is for
            <a href="https://rockhoundingnear.com" target="_blank" rel="noopener">RockhoundingNear.com</a>
            and is meant for consumption by search engines like Google and Bing.
          </div>
        </div>
        <span class="count-badge">
          <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
        </span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="width:60%">URL</th>
              <th style="width:12%;text-align:center">Images</th>
              <th style="width:12%;text-align:center">Priority</th>
              <th style="width:16%">Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <xsl:variable name="itemURL"><xsl:value-of select="sitemap:loc"/></xsl:variable>
              <tr>
                <td><a href="{$itemURL}"><xsl:value-of select="sitemap:loc"/></a></td>
                <td class="td-num">
                  <xsl:choose>
                    <xsl:when test="count(image:image) &gt; 0">
                      <xsl:value-of select="count(image:image)"/>
                    </xsl:when>
                    <xsl:otherwise>—</xsl:otherwise>
                  </xsl:choose>
                </td>
                <td class="td-num">
                  <xsl:choose>
                    <xsl:when test="sitemap:priority &gt;= 0.8">
                      <span class="badge-priority"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:when test="sitemap:priority &gt;= 0.5">
                      <span class="badge-priority badge-priority-mid"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:when test="sitemap:priority">
                      <span class="badge-priority badge-priority-low"><xsl:value-of select="sitemap:priority"/></span>
                    </xsl:when>
                    <xsl:otherwise>—</xsl:otherwise>
                  </xsl:choose>
                </td>
                <td class="td-date">
                  <xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </div>
    </xsl:if>

    <div class="site-footer">
      Generated by <a href="https://rockhoundingnear.com">RockhoundingNear.com</a>
      &#8212; the US rockhounding directory.
    </div>

  </div>

</body>
</html>
</xsl:template>
</xsl:stylesheet>
