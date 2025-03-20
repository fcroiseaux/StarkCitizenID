'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold sm:text-5xl">
          StarkCitizenID
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          {t('home.title')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="card space-y-4">
          <h2 className="text-2xl font-bold">{t('home.verificationTitle')}</h2>
          <p className="text-gray-600">
            {t('home.verificationDescription')}
          </p>
          <Link href="/verify" className="btn">{t('common.verifyIdentity')}</Link>
        </div>

        <div className="card space-y-4">
          <h2 className="text-2xl font-bold">{t('home.dashboardTitle')}</h2>
          <p className="text-gray-600">
            {t('home.dashboardDescription')}
          </p>
          <Link href="/dashboard" className="btn btn-outline">{t('common.goToDashboard')}</Link>
        </div>
      </div>

      <div className="w-full max-w-5xl space-y-8 mt-8">
        <h2 className="text-2xl font-bold text-center">{t('home.howItWorks')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-4 space-y-2">
            <div className="rounded-full bg-white border w-10 h-10 flex items-center justify-center font-bold" style={{backgroundColor: "rgba(0, 112, 243, 0.1)"}}>1</div>
            <h3 className="font-bold">{t('home.step1Title')}</h3>
            <p className="text-sm text-gray-600">
              {t('home.step1Description')}
            </p>
          </div>
          
          <div className="card p-4 space-y-2">
            <div className="rounded-full bg-white border w-10 h-10 flex items-center justify-center font-bold" style={{backgroundColor: "rgba(0, 112, 243, 0.1)"}}>2</div>
            <h3 className="font-bold">{t('home.step2Title')}</h3>
            <p className="text-sm text-gray-600">
              {t('home.step2Description')}
            </p>
          </div>
          
          <div className="card p-4 space-y-2">
            <div className="rounded-full bg-white border w-10 h-10 flex items-center justify-center font-bold" style={{backgroundColor: "rgba(0, 112, 243, 0.1)"}}>3</div>
            <h3 className="font-bold">{t('home.step3Title')}</h3>
            <p className="text-sm text-gray-600">
              {t('home.step3Description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
