'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy } from 'lucide-react';

interface QRCodeGeneratorProps {
  upiId: string;
  amount: number;
}

export function QRCodeGenerator({ upiId, amount }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const qrLoaded = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const upiString = `upi://pay?pa=${encodeURIComponent(
    upiId
  )}&pn=Picnic&am=${amount}&cu=INR&tn=Picnic%20Payment`;

  // Detect Mobile device
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsMobile(/android|iphone|ipad|ipod/.test(ua));
  }, []);

  // Load QR LIBRARY ONLY ONCE
  useEffect(() => {
    if (qrLoaded.current) return;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';

    script.onload = () => {
      qrLoaded.current = true;
      generateQR();
    };

    script.onerror = () => setError('Failed to load QR code library');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Generate QR only after script is loaded
  const generateQR = () => {
    if (!canvasRef.current || !(window as any).QRCode) return;

    setError(null);
    canvasRef.current.innerHTML = ''; // remove duplicates

    try {
      new (window as any).QRCode(canvasRef.current, {
        text: upiString,
        width: 250,
        height: 250,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: (window as any).QRCode.CorrectLevel.H
      });
    } catch (e) {
      setError('Failed to generate QR code');
    }
  };

  // Regenerate QR if amount or upi changes
  useEffect(() => {
    if (qrLoaded.current) generateQR();
  }, [upiId, amount]);

  // Copy UPI ID
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // PAYMENT BUTTON HANDLER
  const payNow = (app: 'gpay' | 'phonepe' | 'paytm' | 'default') => {
    const params = `pa=${upiId}&pn=Picnic&am=${amount}&cu=INR&tn=Picnic%20Payment`;

    let url = '';

    if (app === 'gpay') {
      url = `gpay://upi/pay?${params}`;
    } else if (app === 'paytm') {
      url = `paytm://upi/pay?${params}`;
    } else if (app === 'phonepe') {
      url = `upi://pay?${params}`; // PhonePe doesn't allow deep links anymore
    } else {
      url = `upi://pay?${params}`;
    }

    window.location.href = url;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment QR Code</CardTitle>
        <CardDescription>Scan to send ₹{amount} payment</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-col items-center gap-4">

            {/* QR CODE */}
            <div
              ref={canvasRef}
              className="p-4 bg-white rounded-lg border border-border"
            ></div>

            {/* COPY SECTION */}
            <p className="text-sm font-medium flex justify-center items-center gap-2">
              UPI ID: {upiId}
              <button onClick={copyToClipboard} className="p-1 hover:opacity-70">
                <Copy size={16} />
              </button>
              {copied && <span className="text-green-600 text-xs">Copied!</span>}
            </p>

            <p className="text-sm text-muted-foreground">Amount: ₹{amount}</p>

            {/* MOBILE-ONLY PAYMENT BUTTONS */}
            {isMobile && (
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => payNow('gpay')}
                  className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
                >
                  Pay with Google Pay
                </button>

                <button
                  onClick={() => payNow('phonepe')}
                  className="w-full py-2 rounded-lg bg-violet-600 text-white text-sm font-medium"
                >
                  Pay with PhonePe
                </button>

                <button
                  onClick={() => payNow('paytm')}
                  className="w-full py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium"
                >
                  Pay with Paytm
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
