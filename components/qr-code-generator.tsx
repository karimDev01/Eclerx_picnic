'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QRCodeGeneratorProps {
  upiId: string;
  amount: number;
}

export function QRCodeGenerator({ upiId, amount }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const generateQR = async () => {
      try {
        setError(null);
        
        // Clear previous QR code
        if (canvasRef.current) {
          canvasRef.current.innerHTML = '';
        }

        // Load QR code library
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        
        script.onload = () => {
          try {
            // Generate UPI string format: upi://pay?pa=UPI_ID&pn=PAYEE_NAME&tn=TRANSACTION_DESCRIPTION&am=AMOUNT
            const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&tn=Picnic%20Payment&am=${amount}`;

            // Create QR code with improved settings
            if (canvasRef.current) {
              new (window as any).QRCode(canvasRef.current, {
                text: upiString,
                width: 250,
                height: 250,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: (window as any).QRCode.CorrectLevel.H,
              });
            }
          } catch (err) {
            console.error('Error generating QR code:', err);
            setError('Failed to generate QR code');
          }
        };

        script.onerror = () => {
          setError('Failed to load QR code library');
        };

        document.body.appendChild(script);

        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        };
      } catch (err) {
        console.error('Error:', err);
        setError('Error generating QR code');
      }
    };

    generateQR();
  }, [upiId, amount]);

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
            <div 
              ref={canvasRef} 
              className="p-4 bg-white rounded-lg border border-border flex items-center justify-center"
            />
            <div className="text-center">
              <p className="text-sm font-medium">UPI ID: {upiId}</p>
              <p className="text-sm text-muted-foreground">Amount: ₹{amount}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
