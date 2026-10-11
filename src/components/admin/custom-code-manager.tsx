"use client";

import { useState, useEffect } from "react";
import { Code2, Save, Loader2, Check, AlertCircle, Trash2 } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/lib/api-hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomCodeManager() {
  const settingsQ = useSettings();
  const updateMutation = useUpdateSettings();

  const [headerCode, setHeaderCode] = useState("");
  const [footerCode, setFooterCode] = useState("");
  const [loaded, setLoaded] = useState(false);

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

  const dirty =
    headerCode !== (settingsQ.data.customHeaderCode ?? "") ||
    footerCode !== (settingsQ.data.customFooterCode ?? "");

  const handleSave = () => {
    updateMutation.mutate({
      customHeaderCode: headerCode,
      customFooterCode: footerCode,
    });
  };

  const handleReset = () => {
    setHeaderCode(settingsQ.data?.customHeaderCode ?? "");
    setFooterCode(settingsQ.data?.customFooterCode ?? "");
  };

  const handleClear = () => {
    setHeaderCode("");
    setFooterCode("");
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
          <li>🔍 Google Search Console verification</li>
          <li>🎨 Custom CSS (&lt;style&gt; tags)</li>
          <li>💬 Live chat widgets (Tawk.to, Intercom)</li>
          <li>📈 Conversion tracking pixels</li>
          <li>🏷️ Schema.org structured data</li>
          <li>🔔 OneSignal push notifications</li>
        </ul>
      </Card>
    </div>
  );
}

export default CustomCodeManager;
