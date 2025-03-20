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
      
      {/* Section DeFi */}
      <div className="w-full max-w-5xl space-y-8 mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-blue-800">{t('home.defiTitle')}</h2>
          <p className="text-gray-700">{t('home.defiSubtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">{t('home.forUsersTitle')}</h3>
            <ul className="space-y-3">
              {t('home.forUsersItems').map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">{t('home.forProvidersTitle')}</h3>
            <ul className="space-y-3">
              {t('home.forProvidersItems').map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-blue-100 p-4 rounded-lg mt-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-800">{t('home.privacyTitle')}</h3>
              <p className="mt-2 text-sm text-blue-700">
                {t('home.privacyDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
