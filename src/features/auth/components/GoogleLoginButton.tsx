"use client";

import Script from "next/script";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button";
import ErrorMessage from "@/components/ui/ErrorMessage";

type GoogleLoginButtonProps = {
  onCredential: (idToken: string) => void;
};

type GoogleCredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleLoginButton({ onCredential }: GoogleLoginButtonProps) {
  const initializedRef = useRef(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!scriptReady || !clientId || !window.google || initializedRef.current) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (!response.credential) {
          setError("Google 인증 정보를 받지 못했습니다.");
          return;
        }

        setError(null);
        onCredential(response.credential);
      },
    });
    initializedRef.current = true;
  }, [clientId, onCredential, scriptReady]);

  const handleClick = useCallback(() => {
    if (!clientId) {
      setError("NEXT_PUBLIC_GOOGLE_CLIENT_ID 설정이 필요합니다.");
      return;
    }

    if (!scriptReady || !initializedRef.current || !window.google) {
      setError("Google 로그인을 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setError(null);
    window.google.accounts.id.prompt();
  }, [clientId, scriptReady]);

  if (!clientId) {
    return <ErrorMessage message="NEXT_PUBLIC_GOOGLE_CLIENT_ID 설정이 필요합니다." />;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onError={() => setError("Google 로그인 스크립트를 불러오지 못했습니다.")}
      />
      <Button variant="outline" onClick={handleClick} disabled={!scriptReady}>
        <Image
          src="/images/google.svg"
          alt="Google"
          width={16}
          height={16}
          style={{ width: 16, height: 16, flexShrink: 0 }}
          className="opacity-55"
          unoptimized
        />
        Google
      </Button>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
