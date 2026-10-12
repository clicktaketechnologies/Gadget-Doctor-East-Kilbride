"use client";

import { useState, useEffect } from "react";
import { Code2, Save, Loader2, Check, AlertCircle, Trash2, ShieldCheck, Search, Zap } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/lib/api-hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CustomCodeManager() {
  const settingsQ = useSettings();
  const updateMutation = useUpdateSettings();

  const [headerCode, setHeaderCode] = useState("");
  const [footerCode, setFooterCode] = useState("");
  const [googleVerification, setGoogleVerification] = useState("");
  const [bingVerification, setBingVerification] = useState("");
  const [customMetaTags, setCustomMetaTags] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; google: boolean; bing: boolean; message: string } | null>(null);

  // Initialize from server data (key-remount pattern)
  useEffect(() => {
    if (settingsQ.data && !loaded) {
      setHeaderCode(settingsQ.data.customHeaderCode ?? "");
      setFooterCode(settingsQ.data.customFooterCode ?? "");
      setLoaded(true);
    }
  }, [settingsQ.data, loaded]);

  if (settingsQ.isLoading || !settingsQ.data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-40 rounded" />
        <Skeleton className="h-48 w-full rounded" />
        <Skeleton className="h-48 w-full rounded" />
      </div>
    );
  }

  // Build the combined header code: verification tags + custom header code
  const buildHeaderCode = () => {
    const parts = [];
    if (googleVerification.trim()) {
      // If user pasted the full meta tag, use it as-is; otherwise wrap it
      const val = googleVerification.trim();
      if (val.startsWith("<meta") || val.startsWith("<")) {
        parts.push(`<!-- Google Search Console Verification -->
${val}`);
      } else {
        parts.push(`<!-- Google Search Console Verification -->
<meta name="google-site-verification" content="${val}" />`);
      }
    }
    if (bingVerification.trim()) {
      const val = bingVerification.trim();
      if (val.startsWith("<meta") || val.startsWith("<")) {
        parts.push(`<!-- Bing Webmaster Tools Verification -->
${val}`);
      } else {
        parts.push(`<!-- Bing Webmaster Tools Verification -->
<meta name="msvalidate.01" content="${val}" />`);
      }
    }
    if (customMetaTags.trim()) {
      parts.push(`<!-- Custom Meta Tags -->
${customMetaTags.trim()}`);
    }
    if (headerCode.trim()) {
      parts.push(`<!-- Custom Header Code -->
${headerCode.trim()}`);
    }
    return parts.join("\n\n");
  };

  const dirty =
    buildHeaderCode() !== (settingsQ.data.customHeaderCode ?? "") ||
    footerCode !== (settingsQ.data.customFooterCode ?? "");

  const handleSave = () => {
    updateMutation.mutate({
      customHeaderCode: buildHeaderCode(),
      customFooterCode: footerCode,
    });
  };

  const handleReset = () => {
    setHeaderCode(settingsQ.data?.customHeaderCode ?? "");
    setFooterCode(settingsQ.data?.customFooterCode ?? "");
    setGoogleVerification("");
    setBingVerification("");
    setCustomMetaTags("");
  };

  const handleClear = () => {
    setHeaderCode("");
    setFooterCode("");
    setGoogleVerification("");
    setBingVerification("");
    setCustomMetaTags("");
    setTestResult(null);
  };

  // Test verification — fetches the live site HTML and checks for meta tags
  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      // Try the current origin first (same-origin, no CORS issues)
      // Then try Firebase if on Render
      const testUrl = window.location.hostname.includes("onrender.com")
        ? "https://gadgetdoctorls.web.app/"
        : window.location.origin;
      const res = await fetch(testUrl, { mode: "cors" });
      const html = await res.text();

      const hasGoogle = googleVerification
        ? html.includes(googleVerification) || html.includes("google-site-verification")
        : true; // skip if not set
      const hasBing = bingVerification
        ? html.includes(bingVerification) || html.includes("msvalidate.01")
        : true;

      setTestResult({
        ok: hasGoogle && hasBing,
        google: hasGoogle,
        bing: hasBing,
        message:
          hasGoogle && hasBing
            ? "✅ All verification tags found in the live HTML! Google can verify your site."
            : `⚠️ Some tags not found in live HTML. Tags must be in the raw HTML source (not just JavaScript-injected). Make sure you saved the code and the site has been redeployed.`
      });
    } catch (e) {
      setTestResult({
        ok: false,
        google: false,
        bing: false,
        message: `❌ Failed to fetch the site: ${e instanceof Error ? e.message : "unknown error"}`,
      });
    }
    setTesting(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Custom Code</h2>
        <p className="text-sm text-muted-foreground">
          Add custom HTML, CSS, or JavaScript to the site header and footer.
          Useful for Google Analytics, Facebook Pixel, Search Console
          verification, custom CSS, and more.
        </p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
        <AlertCircle className="size-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">⚠️ Only add code from sources you trust.</p>
          <p className="mt-0.5 text-amber-300/80">
            Custom code runs on every page. Malicious code could compromise
            your site. Changes are live after saving + page refresh.
          </p>
        </div>
      </div>

      {/* Site Verification */}
      <Card className="glass flex flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Site Verification Tags
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Verify your site ownership with Google Search Console, Bing
              Webmaster Tools, and other search engines. Paste only the
              verification code value (not the full HTML tag).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="google-verify" className="text-xs">
              🔍 Google Search Console verification
            </Label>
            <Textarea
              id="google-verify"
              placeholder="Paste the content value from: <meta name='google-site-verification' content='THIS_PART' />"
              value={googleVerification}
              onChange={(e) => setGoogleVerification(e.target.value)}
              rows={2}
              className="font-mono text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              Google Search Console → Settings → Verification → HTML tag → copy the content value
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bing-verify" className="text-xs">
              🔎 Bing Webmaster Tools verification
            </Label>
            <Textarea
              id="bing-verify"
              placeholder="Paste the content value from: <meta name='msvalidate.01' content='THIS_PART' />"
              value={bingVerification}
              onChange={(e) => setBingVerification(e.target.value)}
              rows={2}
              className="font-mono text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              Bing Webmaster Tools → Configure → Verify → Meta tag → copy the content value
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="custom-meta" className="text-xs">
            🏷️ Custom meta tags (paste full tags)
          </Label>
          <Textarea
            id="custom-meta"
            placeholder={`<!-- Example: -->
<meta name="yandex-verification" content="..." />
<meta name="p:domain_verify" content="..." />`}
            value={customMetaTags}
            onChange={(e) => setCustomMetaTags(e.target.value)}
            rows={3}
            className="font-mono text-xs"
          />
          <p className="text-[11px] text-muted-foreground">
            For Yandex, Pinterest, Alexa, or any other verification meta tags — paste the full &lt;meta&gt; tag here
          </p>
        </div>
      </Card>

      {/* Test Verification */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Test if your verification tags are visible in the live HTML source
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={testing}
            className="gap-2"
          >
            {testing ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Testing…
              </>
            ) : (
              <>
                <Zap className="size-3.5" />
                Test Verification
              </>
            )}
          </Button>
        </div>
        {testResult && (
          <div
            className={cn(
              "rounded-lg border p-3 text-sm",
              testResult.ok
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
            )}
          >
            <div className="flex items-start gap-2">
              {testResult.ok ? (
                <Check className="size-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium">{testResult.message}</p>
                {googleVerification && (
                  <p className="mt-1 text-xs">
                    Google: {testResult.google ? "✅ Found" : "❌ Not found in HTML"}
                  </p>
                )}
                {bingVerification && (
                  <p className="mt-1 text-xs">
                    Bing: {testResult.bing ? "✅ Found" : "❌ Not found in HTML"}
                  </p>
                )}
                {!testResult.ok && (
                  <p className="mt-2 text-xs text-amber-300/80">
                    💡 After saving, wait for Render to redeploy (3-5 min),
                    then test again. The tags are server-rendered into the
                    raw HTML on Render, not client-injected.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Header Code */}
      <Card className="glass flex flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
            <Code2 className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Header Code (injected into &lt;head&gt;)
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              For Google Analytics, Facebook Pixel, Search Console meta tags,
              Schema markup, &lt;style&gt; tags, etc.
            </p>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="header-code" className="text-xs">
            Paste your code here
          </Label>
          <Textarea
            id="header-code"
            placeholder={`<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>`}
            value={headerCode}
            onChange={(e) => setHeaderCode(e.target.value)}
            rows={10}
            className="font-mono text-xs"
          />
        </div>
      </Card>

      {/* Footer Code */}
      <Card className="glass flex flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
            <Code2 className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Footer Code (injected before &lt;/body&gt;)
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              For chat widgets, conversion tracking pixels, custom scripts,
              pop-up embeds, etc.
            </p>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="footer-code" className="text-xs">
            Paste your code here
          </Label>
          <Textarea
            id="footer-code"
            placeholder={`<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {...}
</script>
<noscript>
  <img height="1" width="1" src="..." />
</noscript>`}
            value={footerCode}
            onChange={(e) => setFooterCode(e.target.value)}
            rows={10}
            className="font-mono text-xs"
          />
        </div>
      </Card>

      {/* Save bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {dirty && (
            <span className="text-xs text-amber-400">
              ● Unsaved changes — refresh page after saving to see code live
            </span>
          )}
          {!dirty && settingsQ.data.customHeaderCode === "" && settingsQ.data.customFooterCode === "" && (
            <span className="text-xs text-muted-foreground">No custom code set</span>
          )}
          {!dirty && (settingsQ.data.customHeaderCode !== "" || settingsQ.data.customFooterCode !== "") && (
            <span className="text-xs text-emerald-400">✓ Custom code is live</span>
          )}
        </div>
        <div className="flex gap-2">
          {dirty && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
          )}
          {(headerCode || footerCode) && (
            <Button variant="outline" size="sm" onClick={handleClear} className="text-rose-400">
              <Trash2 className="size-3.5" />
              Clear All
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!dirty || updateMutation.isPending}
            className="gap-2"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : updateMutation.isSuccess ? (
              <>
                <Check className="size-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save Code
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Common uses */}
      <Card className="glass p-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Common uses
        </h4>
        <ul className="grid grid-cols-1 gap-1 text-xs text-muted-foreground sm:grid-cols-2">
          <li>📊 Google Analytics 4 (GA4)</li>
          <li>🔵 Facebook / Meta Pixel</li>
          <li>🔍 Google Search Console HTML tag verification</li>
          <li>🔎 Bing Webmaster Tools verification</li>
          <li>🎨 Custom CSS (&lt;style&gt; tags)</li>
          <li>💬 Live chat widgets (Tawk.to, Intercom)</li>
          <li>📈 Conversion tracking pixels</li>
          <li>🏷️ Schema.org structured data</li>
          <li>🔔 OneSignal push notifications</li>
          <li>🌐 Yandex / Pinterest / Alexa verification</li>
        </ul>
      </Card>
    </div>
  );
}

export default CustomCodeManager;
