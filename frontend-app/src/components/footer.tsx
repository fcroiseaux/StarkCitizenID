'use client';

import { useLanguage } from "@/lib/i18n/language-context";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <p>StarkCitizenID - {t('common.footer')}</p>
  );
}