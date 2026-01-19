export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const path = url.pathname;
      const searchParams = url.searchParams;
  
      // --- CONFIGURATION ---
      const BLOCKSCOUT_KEY = env.BLOCKSCOUT_API_KEY || ""; 
      const BLOCKSCOUT_API = "https://base.blockscout.com/api/v2"; 
      
      const rpcList = [
        env.MY_RPC_URL,env.MY_RPC_URL2,
        "https://mainnet.base.org",
        "https://base.publicnode.com"
      ].filter(Boolean);
  
      const RPC_URL = rpcList[0];
  
      // --- CSS & HEADER ---
      const headerHtml = `
      <!doctype html>
      <html lang="en" data-bs-theme="dark">
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>BASE Explorer | Lite Version</title>
          <link rel="shortcut icon" href="https://docs.base.org/img/favicon.ico">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

          <meta name="robots" content="index, follow">
          <meta name="googlebot" content="index, follow">
          <meta name="msvalidate.01" content="93244754BDD97315832997B34C3A0E10" />
          <meta name="yandex-verification" content="a31cb882766c0146" />
          <meta name="3a35793fd4ad07d99c234b065bf345f75251ce8e" content="3a35793fd4ad07d99c234b065bf345f75251ce8e" />
          <meta name="facebook-domain-verification" content="dnnn9gv21p7vl596awb3xx69vabjy4" />
          <meta property="og:type" content="website">
          <meta property="og:url" content="https://baseplorer.iqbal.sbs/">
          <meta property="og:title" content="BASE Explorer | Lite Version">
          <meta property="og:description" content="Base Network Explorer | Fast, Simple, and responsive.">
          <meta property="og:image" content="https://iqbal.sbs/img/baseplorer.png">

          <meta property="twitter:card" content="summary_large_image">
          <meta property="twitter:url" content="https://baseplorer.iqbal.sbs/">
          <meta property="twitter:title" content="BASE Explorer | Lite Version">
          <meta property="twitter:description" content="Base Network Explorer | Fast, Simple, and responsive.">
          <meta name="referrer" content="no-referrer-when-downgrade" />
          <meta property="twitter:image" content="https://iqbal.sbs/img/baseplorer.png">

          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="yandex-verification" content="f1937fa4fdcb8c97" />
          <meta name="msvalidate.01" content="5976EA5A7525CFD1DF2130F928CDDF23" />
          <meta name="geo.region" content="ID-SS" />
          <meta name="geo.placename" content="Palembang" />

          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Muhamad Iqbal",
              "url": "https://iqbal.sbs/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://iqbal.sbs/api/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          </script>
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Muhamad Iqbal",
              "url": "https://iqbal.sbs",
              "image": "https://iqbal.sbs/img/profile.webp",
              "jobTitle": "Building Engineer & Web Developer",
              "sameAs": ["https://www.linkedin.com/in/iqbal-sbs/", "https://www.instagram.com/lennoniqbal", "https://x.com/trinaldao", "https://github.com/iqbal26"]
            }
          </script>
          <style>
              :root {
                  --bg-dark: #050505;
                  --primary-glow: rgba(0, 82, 255, 0.6);
                  --secondary-glow: rgba(120, 0, 255, 0.4);
                  --glass-bg: rgba(255, 255, 255, 0.03);
                  --glass-border: rgba(255, 255, 255, 0.08);
                  --text-main: #ffffff;
                  --text-muted: #8899a6;
                  --accent: #0052ff;
              }
              body { font-family: "Plus Jakarta Sans", sans-serif; background-color: var(--bg-dark); color: var(--text-main); min-height: 100vh; overflow-x: hidden; position: relative; }
              
              .blob-cont { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: -1; pointer-events: none; overflow: hidden; }
              .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; animation: float 10s infinite ease-in-out alternate; }
              .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: var(--primary-glow); }
              .blob-2 { bottom: -10%; right: -10%; width: 40vw; height: 40vw; background: var(--secondary-glow); animation-delay: -5s; }
              
              .glass-panel { background: var(--glass-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid var(--glass-border); border-radius: 20px; }
              .glass-wrapper { position: relative; border-radius: 20px; margin-bottom: 1.5rem; }
              .glass-bg { position: absolute; inset: 0; background: var(--glass-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid var(--glass-border); border-radius: 20px; z-index: 0; }
              .glass-content { position: relative; z-index: 1; padding: 1.5rem; } 
  
              .navbar { background: rgba(5, 5, 5, 0.6); backdrop-filter: blur(20px); border-bottom: 1px solid var(--glass-border); }
              .card { background: var(--glass-bg) !important; backdrop-filter: blur(12px); border: 1px solid var(--glass-border); border-radius: 16px; }
              .card-header { background: transparent; border-bottom: 1px solid var(--glass-border); color: #fff; font-weight: 600; padding: 1.2rem; }
              
              a { color: #60a5fa; text-decoration: none; transition: 0.3s; }
              a:hover { color: #93c5fd; }
              .hash-tag { font-family: monospace; letter-spacing: -0.5px; color: #a5b4fc; }
              
              .dropdown-menu { max-height: 300px; overflow-y: auto; background: rgba(15, 15, 20, 0.98); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); z-index: 10000 !important; }
              .dropdown-menu::-webkit-scrollbar { width: 5px; }
              .dropdown-menu::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
              
              .nft-img-wrapper { width: 100%; padding-top: 100%; position: relative; background: rgba(0,0,0,0.2); border-radius: 10px; overflow: hidden; }
              .nft-img { position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; }
              .text-glow { text-shadow: 0 0 20px rgba(255,255,255,0.2); }
              .ls-1 { letter-spacing: 1px; }
  
              /* --- RESPONSIVE AD CSS --- */
              .ad-container { 
                  display: flex; 
                  justify-content: center; 
                  overflow: hidden; 
                  width: 100%; 
              }
              .ad-scaler { 
                  width: 728px; 
                  height: 90px; 
                  transform-origin: top center; 
                  transition: transform 0.3s ease; 
              }
              
              /* Tablet: Scale down to 80% */
              @media (max-width: 800px) { 
                  .ad-scaler { transform: scale(0.8); margin-bottom: -18px; } 
              }
              /* Mobile Large: Scale down to 55% */
              @media (max-width: 500px) { 
                  .ad-scaler { transform: scale(0.55); margin-bottom: -40px; } 
              }
              /* Mobile Small: Scale down to 42% */
              @media (max-width: 380px) { 
                  .ad-scaler { transform: scale(0.42); margin-bottom: -52px; } 
              }
          </style>
      </head>
      <body>
          <div class="blob-cont"><div class="blob blob-1"></div><div class="blob blob-2"></div></div>
          <nav class="navbar sticky-top navbar-expand-lg">
              <div class="container-xxl">
                  <a class="navbar-brand d-flex align-items-center text-white" href="/">
                      <div style="width:32px;height:32px;background:var(--accent);border-radius:10px;margin-right:12px; display:grid; place-items:center; box-shadow: 0 0 15px var(--primary-glow);"><i class="fa-brands fa-ethereum text-white"></i></div>
                      <span class="fw-bold tracking-wide">BASEPLORER</span>
                  </a>
                  <a href="/" class="btn btn-sm btn-outline-light rounded-pill px-3 ms-auto" style="border-color: var(--glass-border);">Home</a>
              </div>
          </nav>
      `;
  
      const footerHtml = `
     <footer style="text-align: center; margin-top: 50px; padding: 20px; border-top: 1px solid #333;">
      <p> © 2025 Base Block Explorer | Lite Version</p>
      <div style="margin-top: 10px; font-size: 0.9em;">
        <a href="https://iqbal.sbs/privacy" style="color: #aaa; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | <a href="https://iqbal.sbs/disclaimer" style="color: #aaa; text-decoration: none; margin: 0 10px;">Disclaimer</a> | <a href="https://iqbal.sbs/about-us" style="color: #aaa; text-decoration: none; margin: 0 10px;">about-us</a> | <a href="https://iqbal.sbs/contact" style="color: #aaa; text-decoration: none; margin: 0 10px;">Contact</a>
      </div>
    </footer>
  </main>
</div>
<link rel="stylesheet" href="https://iqbal.sbs/cookie.css">
<div id="cookie-banner">
  <div class="cookie-content">
    <div class="cookie-text">
      <h3>🍪 Privasi & Cookie</h3>
      <p> Website ini menggunakan cookie untuk memastikan pengalaman terbaik. <a href="/privacy">Lihat Kebijakan</a>. </p>
    </div>
    <div class="cookie-buttons">
      <button id="btn-reject-all" class="btn-cookie btn-reject">Tolak</button>
      <button id="btn-open-settings" class="btn-cookie btn-settings">Atur</button>
      <button id="btn-accept-all" class="btn-cookie btn-accept">Terima</button>
    </div>
  </div>
</div>
<div id="cookie-modal">
  <div class="modal-content">
    <h3 style="color:#00ffff; margin-top:0;">Pengaturan Privasi</h3>
    <div class="switch-container">
      <div class="switch-label">
        <h4>Wajib</h4>
        <p> Diperlukan agar web berfungsi. </p>
      </div>
      <label class="switch">
        <input type="checkbox" checked disabled>
        <span class="slider"></span>
      </label>
    </div>
    <div class="switch-container">
      <div class="switch-label">
        <h4>Iklan (AdSense)</h4>
        <p> Iklan relevan. </p>
      </div>
      <label class="switch">
        <input type="checkbox" id="chk-marketing" checked>
        <span class="slider"></span>
      </label>
    </div>
    <div class="modal-actions">
      <button onclick="document.getElementById('cookie-modal').style.display='none'" class="btn-cookie btn-reject" style="margin-right:10px;">Batal</button>
      <button id="btn-save-settings" class="btn-cookie btn-accept">Simpan</button>
    </div>
  </div>
</div>
<script src="https://iqbal.sbs/cookie-consent.js"></script>
<script src="https://iqbal.sbs/script.js?v24"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </body></html>
      `;
  
      // --- RESPONSIVE AD HTML TEMPLATE ---
      const adBannerHtml = `
      <div class="container-xxl mb-4">
        <div class="glass-panel p-3 text-center position-relative overflow-hidden">
            <span class="text-secondary small fw-bold text-uppercase" style="letter-spacing:2px; font-size:0.6rem; display:block; margin-bottom:10px;">Sponsored</span>
            <div class="ad-container">
                <div class="ad-scaler">
                    <iframe data-aa='2424584' src='//ad.a-ads.com/2424584/?size=728x90'
                            style='border:0; padding:0; width:728px; height:90px; overflow:hidden; display: block;'></iframe>
                </div>
            </div>
        </div>
      </div>
      `;
  
      // ============================================
      // ROUTING LOGIC
      // ============================================
      
      // --- ROUTE 1: DETAIL TOKEN ---
      if (path.startsWith("/token/")) {
          const match = path.match(/\/token\/(0x[a-fA-F0-9]{40})/i);
          const walletAddr = searchParams.get("a");
          
          if (match && !walletAddr) return new Response("Missing wallet parameter (?a=ADDRESS)", { status: 400 });
          
          if (match && walletAddr) {
              const contractAddr = match[1]; 
              return new Response(`
              ${headerHtml}
              <div class="container-xxl py-5">
                  ${adBannerHtml} <div class="d-flex align-items-center mb-4"><a href="/address/${walletAddr}" class="btn btn-outline-light rounded-circle me-3" style="width:40px;height:40px; border-color:var(--glass-border);"><i class="fa fa-arrow-left mt-1"></i></a><div><h4 class="mb-0 fw-bold text-white">Token Details</h4></div></div>
                  <div class="glass-panel p-4 mb-4">
                      <div class="row align-items-center">
                          <div class="col-md-6 mb-3 mb-md-0"><div class="text-uppercase small text-muted fw-bold mb-1">Contract Address</div><div class="hash-tag text-break fs-5">${contractAddr}</div></div>
                          <div class="col-md-6 text-md-end"><div class="text-uppercase small text-muted fw-bold mb-1">Balance</div><h1 class="text-white mb-0 text-glow" id="tokenBal">...</h1><div class="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 px-3 py-2 mt-2" id="tokenSymbol"></div></div>
                      </div>
                  </div>
                  <div class="card border-0"><div class="card-header">Transfer History</div><div class="card-body p-0"><div class="table-responsive"><table class="table align-middle mb-0"><thead class="bg-light"><tr><th class="ps-4">Tx Hash</th><th>Age</th><th>From</th><th>To</th><th>Value</th></tr></thead><tbody id="tokenTxBody"></tbody></table></div><div id="loader" class="text-center py-5"><div class="spinner-border text-primary"></div></div></div></div>
              </div>
              <script>
                  const API_BASE = "${BLOCKSCOUT_API}";
                  const CONTRACT = "${contractAddr}"; 
                  const WALLET = "${walletAddr}";
                  function timeAgo(dateStr) { const date = new Date(dateStr); const s=Math.floor((new Date()-date)/1000); if(s<60)return s+"s"; if(s<3600)return Math.floor(s/60)+"m"; if(s<86400)return Math.floor(s/3600)+"h"; return Math.floor(s/86400)+"d"; }
                  function shorten(s) { if(!s) return ""; return s.substring(0,8)+"..."+s.substring(s.length-6); }
                  
                  async function loadTokenData() {
                      try {
                          if(!CONTRACT || CONTRACT === "undefined") throw new Error("Invalid Contract Address");
                          const metaUrl = \`\${API_BASE}/tokens/\${CONTRACT}\`;
                          const balUrl = \`\${API_BASE}/addresses/\${WALLET}/token-balances\`;
                          const txUrl = \`\${API_BASE}/addresses/\${WALLET}/token-transfers?token=\${CONTRACT}\`; 
                          const [metaRes, balRes, txRes] = await Promise.all([ fetch(metaUrl), fetch(balUrl), fetch(txUrl) ]);
                          const metaData = await metaRes.json();
                          const balData = await balRes.json();
                          const txData = await txRes.json(); 
                          
                          let decimals = metaData.decimals ? parseInt(metaData.decimals) : 18;
                          let symbol = metaData.symbol || "TOKEN";
                          const tokenBal = Array.isArray(balData) ? balData.find(t => t.token?.address?.toLowerCase() === CONTRACT.toLowerCase()) : null;
                          
                          if (tokenBal) {
                              const val = parseFloat(tokenBal.value) / Math.pow(10, decimals);
                              document.getElementById('tokenBal').innerText = val.toLocaleString(undefined, {maximumFractionDigits: 4});
                          } else { document.getElementById('tokenBal').innerText = "0"; }
                          document.getElementById('tokenSymbol').innerText = symbol;
                          
                          const tbody = document.getElementById('tokenTxBody'); document.getElementById('loader').style.display = 'none';
                          const items = Array.isArray(txData) ? txData : (txData.items || []);
                          if(items.length > 0) {
                              let rows = ""; 
                              items.forEach(tx => {
                                  const isOut = tx.from?.hash?.toLowerCase() === WALLET.toLowerCase(); 
                                  const badge = isOut ? '<span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 ms-2">OUT</span>' : '<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 ms-2">IN</span>';
                                  const valRaw = (tx.total && tx.total.value) ? tx.total.value : "0";
                                  const val = (parseFloat(valRaw) / Math.pow(10, decimals)).toFixed(4);
                                  const hash = tx.hash || tx.tx_hash || tx.transaction_hash || "";
                                  const fromHash = tx.from?.hash || "???";
                                  const toHash = tx.to?.hash || "???";
                                  rows += \`<tr><td class="ps-4"><a href="/tx/\${hash}" class="hash-tag">\${shorten(hash)}</a></td><td>\${timeAgo(tx.timestamp)}</td><td>\${shorten(fromHash)}</td><td>\${shorten(toHash)} \${badge}</td><td class="fw-bold text-white">\${val}</td></tr>\`;
                              }); tbody.innerHTML = rows;
                          } else { tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">No recent transfers found</td></tr>'; }
                      } catch(e) { console.error("DEBUG:", e); document.getElementById('loader').innerHTML = "<div class='text-danger'>Error: " + e.message + "</div>"; }
                  }
                  loadTokenData();
              </script>
              ${footerHtml}`, { headers: { "content-type": "text/html" } });
          }
      }
  
      // --- ROUTE 2: DETAIL BLOCK ---
      if (path.startsWith("/block/")) {
          const blockNum = path.split("/")[2];
          return new Response(`
          ${headerHtml}
          <div class="container-xxl py-5">
              ${adBannerHtml} <h2 class="mb-4 fw-bold">Block <span class="text-muted">#${blockNum}</span></h2>
              <div id="loader" class="text-center py-5"><div class="spinner-border text-primary"></div></div>
              <div id="blockContent" style="display:none">
                  <div class="glass-panel p-4 mb-4">
                      <div class="row g-3">
                          <div class="col-md-3 text-muted">Timestamp</div><div class="col-md-9 text-white fw-medium" id="bTime"></div><div class="col-12"><hr style="border-color:var(--glass-border)"></div>
                          <div class="col-md-3 text-muted">Transactions</div><div class="col-md-9"><span id="bTxCount" class="badge bg-info bg-opacity-25 text-info border border-info border-opacity-25"></span></div><div class="col-12"><hr style="border-color:var(--glass-border)"></div>
                          <div class="col-md-3 text-muted">Gas Used</div><div class="col-md-9 text-white" id="bGas"></div>
                      </div>
                  </div>
                  <div class="card"><div class="card-header">Transactions</div><div class="card-body p-0"><div class="table-responsive"><table class="table align-middle mb-0"><thead class="bg-light"><tr><th class="ps-4">Tx Hash</th><th>From</th><th>To</th><th>Value (ETH)</th></tr></thead><tbody id="bTxTable"></tbody></table></div></div></div>
              </div>
          </div>
          <script>
              const RPC_URL = "${RPC_URL}"; const BLOCK_NUM = "${blockNum}";
              async function loadBlock() {
                  try {
                      const blockHex = "0x" + parseInt(BLOCK_NUM).toString(16);
                      const res = await fetch(RPC_URL, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({jsonrpc:"2.0", method:"eth_getBlockByNumber", params:[blockHex, true], id:1}) });
                      const json = await res.json(); const b = json.result;
                      if(b) {
                          document.getElementById('bTime').innerText = new Date(parseInt(b.timestamp, 16) * 1000).toLocaleString();
                          document.getElementById('bTxCount').innerText = b.transactions.length;
                          document.getElementById('bGas').innerText = parseInt(b.gasUsed, 16).toLocaleString();
                          let rows = ""; b.transactions.slice(0, 50).forEach(tx => {
                              const val = (parseInt(tx.value, 16) / 1e18).toFixed(5);
                              rows += '<tr><td class="ps-4"><a href="/tx/'+tx.hash+'" class="hash-tag">'+tx.hash.substring(0,12)+'...</a></td><td><a href="/address/'+tx.from+'" class="hash-tag text-muted">'+tx.from.substring(0,8)+'...</a></td><td><a href="/address/'+(tx.to||"")+'" class="hash-tag text-muted">'+(tx.to ? tx.to.substring(0,8)+"..." : "Contract Creation")+'</a></td><td>'+val+'</td></tr>';
                          }); document.getElementById('bTxTable').innerHTML = rows; document.getElementById('loader').style.display='none'; document.getElementById('blockContent').style.display='block';
                      }
                  } catch(e){ console.error(e); }
              }
              loadBlock();
          </script>
          ${footerHtml}`, { headers: { "content-type": "text/html" } });
      }
  
      // --- ROUTE 3: DETAIL TX ---
      if (path.startsWith("/tx/")) {
          const txHash = path.split("/")[2];
          return new Response(`
          ${headerHtml}
          <div class="container-xxl py-5">
              ${adBannerHtml} <h4 class="mb-4 fw-bold">Transaction Details</h4>
              <div id="loader" class="text-center py-5"><div class="spinner-border text-primary"></div></div>
              <div id="txContent" style="display:none" class="glass-panel p-4">
                  <div class="row g-4">
                      <div class="col-12"><div class="text-muted small text-uppercase fw-bold mb-1">Transaction Hash</div><div class="hash-tag text-white text-break fs-5">${txHash}</div></div>
                      <div class="col-md-6"><div class="text-muted small text-uppercase fw-bold mb-1">Status</div><div id="dStatus"></div></div>
                      <div class="col-md-6"><div class="text-muted small text-uppercase fw-bold mb-1">Block Height</div><div><a href="#" id="dBlock" class="text-info fw-bold text-decoration-none"></a></div></div><div class="col-12"><hr style="border-color:var(--glass-border)"></div>
                      <div class="col-md-6"><div class="text-muted small text-uppercase fw-bold mb-1">From</div><a href="#" id="dFrom" class="hash-tag text-decoration-none fs-6"></a></div>
                      <div class="col-md-6"><div class="text-muted small text-uppercase fw-bold mb-1">To</div><a href="#" id="dTo" class="hash-tag text-decoration-none fs-6"></a></div>
                      <div class="col-12"><div class="glass-panel p-3 bg-opacity-10 bg-white border-0 mt-2"><div class="text-muted small text-uppercase fw-bold">Value</div><h3 class="text-white mb-0 mt-1"><span id="dValue"></span> ETH</h3></div></div>
                  </div>
              </div>
          </div>
          <script>
              const RPC_URL = "${RPC_URL}"; const TX_HASH = "${txHash}";
              async function rpc(method, params) { const res = await fetch(RPC_URL, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({jsonrpc:"2.0", method:method, params:params, id:1}) }); return (await res.json()).result; }
              async function loadTx() {
                  try {
                      const [tx, rc] = await Promise.all([ rpc("eth_getTransactionByHash", [TX_HASH]), rpc("eth_getTransactionReceipt", [TX_HASH]) ]);
                      if(tx) {
                          const statusHtml = (rc && rc.status==='0x1') ? '<span class="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25"><i class="fa fa-check-circle me-1"></i> Success</span>' : '<span class="badge bg-danger">Failed</span>';
                          document.getElementById('dStatus').innerHTML = statusHtml; document.getElementById('dBlock').innerText = parseInt(tx.blockNumber, 16); document.getElementById('dBlock').href = "/block/" + parseInt(tx.blockNumber, 16);
                          document.getElementById('dFrom').innerText = tx.from; document.getElementById('dFrom').href = "/address/"+tx.from;
                          document.getElementById('dTo').innerText = tx.to || "Contract Creation"; if(tx.to) document.getElementById('dTo').href = "/address/"+tx.to;
                          document.getElementById('dValue').innerText = (parseInt(tx.value,16)/1e18).toFixed(6);
                          document.getElementById('loader').style.display='none'; document.getElementById('txContent').style.display='block';
                      }
                  } catch(e){ console.error(e); }
              }
              loadTx();
          </script>
          ${footerHtml}`, { headers: { "content-type": "text/html" } });
      }
  
      // --- ROUTE 4: HOME & ADDRESS ---
      const mainHtml = `
      ${headerHtml}
        <section style="padding: 6rem 0 4rem 0;">
          <div class="container-xxl text-center">
               <h1 class="hero-title mb-3 text-glow">Base Network Explorer</h1>
               <p class="text-muted mb-5 lead" style="max-width: 600px; margin: 0 auto;">Fast, transparent, and responsive. </p>
               <div class="glass-panel p-2 mx-auto d-flex align-items-center" style="max-width: 700px; box-shadow: 0 0 40px rgba(0,82,255,0.15);">
                  <input type="text" id="walletInput" class="form-control border-0 bg-transparent shadow-none" placeholder="Search by Address / Txn Hash / Block..." style="font-size:1.1rem; height: 50px;">
                  <button class="btn btn-primary rounded-3 px-4 py-2 fw-bold" onclick="handleSearch()"><i class="fa fa-search me-2"></i> Search</button>
               </div>
          </div>
        </section>
  
        <div class="container-xxl pb-5">
          ${adBannerHtml} <div id="homeDashboard" style="display:none;">
            <div class="row g-4">
                <div class="col-lg-6"><div class="card h-100"><div class="card-header d-flex justify-content-between align-items-center"><span>Latest Blocks</span><span class="badge bg-secondary bg-opacity-25 text-light"><i class="fa fa-cubes"></i></span></div><div class="card-body p-0" id="blocksList"><div class="p-5 text-center"><div class="spinner-border text-secondary"></div></div></div><div class="p-3 text-center border-top border-white border-opacity-10"><button class="btn btn-sm btn-link text-decoration-none text-muted" onclick="loadMoreBlocks()" id="btnMoreBlocks">View More Blocks</button></div></div></div>
                <div class="col-lg-6"><div class="card h-100"><div class="card-header d-flex justify-content-between align-items-center"><span>Latest Transactions</span><span class="badge bg-primary bg-opacity-25 text-primary"><i class="fa fa-exchange-alt"></i></span></div><div class="card-body p-0" id="txList"></div><div class="p-3 text-center border-top border-white border-opacity-10"><button class="btn btn-sm btn-link text-decoration-none text-muted" onclick="loadMoreTxs()" id="btnMoreTxs">View More Txns</button></div></div></div>
            </div>
          </div>
  
          <div id="addressView" style="display:none;">
              <div class="glass-wrapper">
                  <div class="glass-bg"></div>
                  <div class="glass-content">
                    <div class="position-absolute top-0 end-0 p-5 opacity-25" style="background: radial-gradient(circle, rgba(0,82,255,0.4) 0%, transparent 70%); width:300px; height:300px; filter:blur(40px); pointer-events:none;"></div>
                    <div class="row align-items-center position-relative">
                        <div class="col-lg-7"><span class="small text-muted fw-bold text-uppercase ls-1">Address</span><h4 class="hash-tag text-break mb-0 text-white mt-1" id="displayAddress"></h4></div>
                        <div class="col-lg-5 text-lg-end mt-4 mt-lg-0">
                            <span class="small text-muted fw-bold text-uppercase ls-1">ETH Balance</span>
                            <h2 class="mb-2 text-white text-glow"><span id="displayBalance">0.00</span> ETH</h2>
                            <div class="dropdown d-inline-block">
                                <button class="btn btn-sm btn-outline-light border-opacity-25 dropdown-toggle" type="button" data-bs-toggle="dropdown"><i class="fa fa-wallet me-1 text-primary"></i> Token Holdings</button>
                                <ul class="dropdown-menu dropdown-menu-end shadow glass-panel border-0 mt-2" id="tokenDropdownList" style="min-width: 250px;"><li><span class="dropdown-item-text text-muted small">Loading...</span></li></ul>
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
  
              <div class="card">
                <div class="card-header p-0 pt-3 px-3">
                    <ul class="nav nav-underline border-bottom-0" id="myTab">
                        <li class="nav-item"><button class="nav-link active text-white" onclick="switchTab('tx')">Transactions</button></li>
                        <li class="nav-item"><button class="nav-link text-muted" onclick="switchTab('token')">Token Transfers</button></li>
                        <li class="nav-item"><button class="nav-link text-muted" onclick="switchTab('nft')">NFT Holdings</button></li>
                    </ul>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive" id="tableView">
                        <table class="table align-middle" style="font-size:0.9rem">
                            <thead class="bg-light" id="tableHead"></thead>
                            <tbody id="tableBody"></tbody>
                        </table>
                    </div>
  
                    <div id="nftView" class="p-4" style="display:none;">
                        <div class="row g-3" id="nftGrid"></div>
                    </div>
  
                    <div class="p-4 text-center" id="tableLoader" style="display:none"><div class="spinner-border spinner-border-sm text-primary"></div> Fetching History...</div>
                    <div class="p-3 text-center border-top border-white border-opacity-10" id="loadMoreContainer" style="display:none">
                        <button class="btn btn-sm btn-link text-decoration-none text-muted" onclick="fetchData(null, true)" id="btnLoadMore">Load More</button>
                    </div>
                </div>
              </div>
          </div>
        </div>
        <script>
          const RPC_URL = "${RPC_URL}"; 
          const API_BASE = "${BLOCKSCOUT_API}";
          const API_KEY = "${BLOCKSCOUT_KEY}";
  
          let currentAddr = ""; 
          let currentTab = "tx"; 
          let pageParams = { tx: null, token: null, nft: null };
          let lastBlockLoaded = 0; let homeTxsCache = []; let homeTxsIndex = 0; let lastTxBlockLoaded = 0;
          
          async function rpc(method, params=[]) { const res = await fetch(RPC_URL, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({jsonrpc:"2.0", method:method, params:params, id:1}) }); return (await res.json()).result; }
          
          function timeAgo(dateStr) { const date = new Date(dateStr); const s=Math.floor((new Date()-date)/1000); if(s<60)return s+"s"; if(s<3600)return Math.floor(s/60)+"m"; if(s<86400)return Math.floor(s/3600)+"h"; return Math.floor(s/86400)+"d"; }
          function shorten(s) { if(!s) return ""; return s.substring(0,8)+"..."+s.substring(s.length-6); }
          function objToQuery(obj) { if(!obj) return ""; return "&" + Object.keys(obj).map(k => k + '=' + obj[k]).join('&'); }
  
          function handleSearch() {
              const val = document.getElementById('walletInput').value.trim();
              if(val.length === 42) location.href = '/address/' + val;
              else if(val.length === 66) location.href = '/tx/' + val;
              else if(!isNaN(val)) location.href = '/block/' + val;
              else alert('Invalid format');
          }
  
          async function loadDashboard() {
            document.getElementById('homeDashboard').style.display = 'block'; document.getElementById('addressView').style.display = 'none';
            try {
                const latestHex = await rpc("eth_blockNumber"); const currentBlock = parseInt(latestHex, 16); lastBlockLoaded = currentBlock; lastTxBlockLoaded = currentBlock;
                document.getElementById('blocksList').innerHTML = ""; await appendBlocks(currentBlock, 5);
                const latestB = await rpc("eth_getBlockByNumber", [latestHex, true]);
                if(latestB && latestB.transactions) { homeTxsCache = latestB.transactions; appendTxs(5); }
            } catch(e) { console.error("Dashboard Error", e); }
          }
  
          async function appendBlocks(startNum, count) {
              let promises = []; for(let i=0; i<count; i++) promises.push(rpc("eth_getBlockByNumber", ["0x"+(startNum-i).toString(16), false]));
              const blocks = await Promise.all(promises); let html = "";
              blocks.forEach(b => { if(b) { const num = parseInt(b.number, 16); html += \`<div class="list-item"><div class="d-flex align-items-center"><div class="me-3 p-2 rounded bg-secondary bg-opacity-10 text-secondary fw-bold text-center" style="width:40px;">Bk</div><div><a href="/block/\${num}" class="d-block fw-bold text-white text-decoration-none">\${num}</a><div class="small text-muted">\${timeAgo(new Date(parseInt(b.timestamp,16)*1000))} ago</div></div><div class="ms-auto text-end small"><div class="d-block text-muted">Miner \${shorten(b.miner)}</div><div class="text-white">\${b.transactions.length} txns</div></div></div></div>\`; if(num < lastBlockLoaded) lastBlockLoaded = num; } });
              document.getElementById('blocksList').insertAdjacentHTML('beforeend', html);
          }
          async function loadMoreBlocks() { const btn = document.getElementById('btnMoreBlocks'); btn.disabled = true; await appendBlocks(lastBlockLoaded - 1, 5); btn.disabled = false; }
          
          function appendTxs(count) {
              let html = ""; const max = Math.min(homeTxsIndex + count, homeTxsCache.length);
              for(let i=homeTxsIndex; i<max; i++) { const tx = homeTxsCache[i]; html += \`<div class="list-item"><div class="d-flex align-items-center"><div class="me-3 p-2 rounded-circle bg-primary bg-opacity-10 text-primary" style="font-size:12px">Tx</div><div class="w-100 overflow-hidden"><a href="/tx/\${tx.hash}" class="hash-tag d-block text-truncate fw-bold text-white text-decoration-none">\${tx.hash}</a><div class="d-flex justify-content-between small text-muted"><span>From \${shorten(tx.from)}</span><span class="text-white">\${(parseInt(tx.value,16)/1e18).toFixed(4)} ETH</span></div></div></div></div>\`; }
              homeTxsIndex = max; document.getElementById('txList').insertAdjacentHTML('beforeend', html);
          }
          async function loadMoreTxs() { const btn = document.getElementById('btnMoreTxs'); btn.disabled = true; if(homeTxsIndex >= homeTxsCache.length) { lastTxBlockLoaded--; const b = await rpc("eth_getBlockByNumber", ["0x"+lastTxBlockLoaded.toString(16), true]); if(b && b.transactions) homeTxsCache = homeTxsCache.concat(b.transactions); } appendTxs(5); btn.disabled = false; }
          
          // --- LOAD ADDRESS ---
          async function loadAddress(addr) { 
              currentAddr = addr; 
              pageParams = { tx: null, token: null, nft: null };
              document.getElementById('homeDashboard').style.display = 'none'; 
              document.getElementById('addressView').style.display = 'block'; 
              document.getElementById('displayAddress').innerText = addr; 
              try {
                  const res = await fetch(\`\${API_BASE}/addresses/\${addr}\`);
                  const data = await res.json();
                  if(data && data.coin_balance) {
                       const bal = (parseFloat(data.coin_balance) / 1e18).toFixed(5);
                       document.getElementById('displayBalance').innerText = bal;
                  }
              } catch(e) { console.error("Balance Error", e); }
              switchTab('tx'); loadTokenHoldings(addr); 
          }
          
          async function loadTokenHoldings(addr) {
             const list = document.getElementById('tokenDropdownList');
             try {
                const res = await fetch(\`\${API_BASE}/addresses/\${addr}/token-balances\`);
                const data = await res.json(); 
                if(data && data.length > 0) {
                   let html = "";
                   data.forEach(t => {
                      if(t.token.type === "ERC-20") {
                          const decimals = t.token.decimals ? parseInt(t.token.decimals) : 18;
                          const bal = (parseFloat(t.value) / Math.pow(10, decimals)).toFixed(2);
                          // CHANGE: Removed Link, just displaying info
                          html += \`<li><div class="dropdown-item d-flex justify-content-between" style="cursor: default;"><span>\${t.token.symbol}</span> <span class="text-white">\${bal}</span></div></li>\`;
                      }
                   });
                   list.innerHTML = html || '<li><span class="dropdown-item-text">No tokens found</span></li>';
                } else { list.innerHTML = '<li><span class="dropdown-item-text">No tokens found</span></li>'; }
             } catch(e) { list.innerHTML = '<li><span class="dropdown-item-text">Error loading tokens</span></li>'; }
          }
  
          function switchTab(tabName) {
              currentTab = tabName; 
              document.querySelectorAll('.nav-link').forEach(el => { el.classList.remove('active', 'text-white'); el.classList.add('text-muted'); });
              const activeBtn = event ? event.target : document.querySelector('button[onclick="switchTab(\\'tx\\')"]'); 
              if(activeBtn) { activeBtn.classList.add('active', 'text-white'); activeBtn.classList.remove('text-muted'); }
              
              const tableHead = document.getElementById('tableHead'); 
              const tableBody = document.getElementById('tableBody'); 
              const nftGrid = document.getElementById('nftGrid');
              
              if(tabName === 'nft') {
                  document.getElementById('tableView').style.display = 'none';
                  document.getElementById('nftView').style.display = 'block';
                  nftGrid.innerHTML = "";
              } else {
                  document.getElementById('tableView').style.display = 'block';
                  document.getElementById('nftView').style.display = 'none';
                  tableBody.innerHTML = "";
              }
  
              document.getElementById('loadMoreContainer').style.display = 'none';
              document.getElementById('tableLoader').style.display = 'block';
              
              if(tabName === 'tx') { 
                  tableHead.innerHTML = '<tr><th class="ps-4">Tx Hash</th><th>Block</th><th>From</th><th>To</th><th>Value</th></tr>'; 
                  fetchData('transactions'); 
              } 
              else if(tabName === 'token') { 
                  tableHead.innerHTML = '<tr><th class="ps-4">Tx Hash</th><th>Age</th><th>From</th><th>To</th><th>Value</th><th>Token</th></tr>'; 
                  fetchData('token-transfers'); 
              }
              else if(tabName === 'nft') {
                  fetchData('nft'); 
              }
          }
          
          async function fetchData(endpointSlug, isLoadMore = false) {
              if(!endpointSlug) {
                  if(currentTab === 'tx') endpointSlug = 'transactions';
                  else if(currentTab === 'token') endpointSlug = 'token-transfers';
                  else if(currentTab === 'nft') endpointSlug = 'nft';
              }
  
              try {
                  let url = \`\${API_BASE}/addresses/\${currentAddr}/\${endpointSlug}?items_count=10\`;
                  
                  if(isLoadMore && pageParams[currentTab]) {
                      url += objToQuery(pageParams[currentTab]);
                  }
  
                  const res = await fetch(url); 
                  const data = await res.json();
                  
                  if(data.next_page_params) {
                      pageParams[currentTab] = data.next_page_params;
                      document.getElementById('loadMoreContainer').style.display = 'block';
                  } else {
                      pageParams[currentTab] = null;
                      document.getElementById('loadMoreContainer').style.display = 'none';
                  }
  
                  document.getElementById('tableLoader').style.display = 'none';
                  const items = data.items ? data.items : [];
  
                  if(currentTab === 'nft') {
                      renderNft(items, isLoadMore);
                  } else {
                      renderTable(items, isLoadMore);
                  }
  
              } catch(e) { console.error(e); document.getElementById('tableLoader').innerText = "Error fetching data"; }
          }
  
          function renderTable(items, append) {
              const tbody = document.getElementById('tableBody');
              if(!append) tbody.innerHTML = "";
              
              if(items.length === 0 && !append) {
                  tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No data found</td></tr>';
                  return;
              }
  
              let html = "";
              items.forEach(item => {
                  const isOut = item.from.hash.toLowerCase() === currentAddr.toLowerCase(); 
                  const badge = isOut ? '<span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 ms-1">OUT</span>' : '<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 ms-1">IN</span>';
                  
                  const fullHash = item.hash || item.tx_hash || item.transaction_hash || "";
                  const hashShort = fullHash ? (fullHash.substring(0,12)+"...") : "???";
                  const blockNum = item.block || item.block_number || "???";
                  const timeVal = timeAgo(item.timestamp);
                  
                  if(currentTab === 'tx') {
                     const toAddr = item.to ? item.to.hash : "Contract Creation";
                     const valEth = (parseFloat(item.value) / 1e18).toFixed(5);
                     html += \`<tr><td class="ps-4"><a href="/tx/\${fullHash}" class="hash-tag text-white text-decoration-none">\${hashShort}</a></td><td><a href="/block/\${blockNum}" class="text-secondary">\${blockNum}</a></td><td>\${shorten(item.from.hash)}</td><td>\${shorten(toAddr)} \${badge}</td><td>\${valEth} ETH</td></tr>\`;
                  }
                  else if(currentTab === 'token') {
                     const decimal = item.token.decimals ? parseInt(item.token.decimals) : 18;
                     const val = (parseFloat(item.total.value)/Math.pow(10, decimal)).toFixed(4);
                     // CHANGE: Token Name is now just text, no link
                     html += \`<tr><td class="ps-4"><a href="/tx/\${fullHash}" class="hash-tag text-white text-decoration-none">\${hashShort}</a></td><td class="text-nowrap">\${timeVal}</td><td>\${shorten(item.from.hash)}</td><td>\${shorten(item.to.hash)} \${badge}</td><td>\${val}</td><td><span class="fw-bold text-white">\${item.token.symbol}</span></td></tr>\`;
                  }
              });
              
              if(append) tbody.insertAdjacentHTML('beforeend', html);
              else tbody.innerHTML = html;
          }
  
          function renderNft(items, append) {
              const grid = document.getElementById('nftGrid');
              if(!append) grid.innerHTML = "";
  
              if(items.length === 0 && !append) {
                  grid.innerHTML = '<div class="col-12 text-center text-muted py-5">No NFTs found</div>';
                  return;
              }
  
              let html = "";
              items.forEach(nft => {
                  // CHANGE: Enhanced Image Extraction
                  const meta = nft.metadata || {};
                  let img = "https://placehold.co/400x400/111/444?text=No+Img";
                  
                  if(nft.image_url) img = nft.image_url;
                  else if(nft.animation_url) img = nft.animation_url; // Some NFTs use animation_url for display
                  else if(meta.image) img = meta.image;
                  
                  // Clean up IPFS protocol to HTTP gateway
                  if(img.startsWith("ipfs://")) {
                      img = img.replace("ipfs://", "https://ipfs.io/ipfs/");
                  }
  
                  const name = nft.name || meta.name || ("Token #" + nft.id);
                  const collName = nft.token ? nft.token.name : "Unknown Collection";
                  
                  html += \`
                  <div class="col-6 col-md-4 col-lg-3">
                      <div class="card h-100 border-0 bg-white bg-opacity-5">
                          <div class="card-body p-2">
                              <div class="nft-img-wrapper mb-2">
                                  <img src="\${img}" class="nft-img" loading="lazy" onerror="this.src='https://placehold.co/400x400/111/444?text=N/A'">
                              </div>
                              <div class="small text-muted text-uppercase mb-1 text-truncate">\${collName}</div>
                              <div class="fw-bold text-white text-truncate">\${name}</div>
                              <div class="small text-secondary">ID: \${shorten(nft.id)}</div>
                          </div>
                      </div>
                  </div>
                  \`;
              });
  
              if(append) grid.insertAdjacentHTML('beforeend', html);
              else grid.innerHTML = html;
          }
  
          // INITIAL ROUTER
          const path = window.location.pathname;
          if(path.startsWith("/address/")) {
              loadAddress(path.split("/")[2]);
          } else {
              loadDashboard();
          }
        </script>
        ${footerHtml}
      `;
  
      if (path === "/" || path.startsWith("/address/")) {
        return new Response(mainHtml, { headers: { "content-type": "text/html" } });
      }
  
      return new Response("Not Found", { status: 404 });
    }
  };
