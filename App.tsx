import React, { useState, useEffect } from 'react';
import { TarotService, TimePeriodOption, Order, WheelPrize, ClubMember } from './types';
import { TAROT_SERVICES } from './data/services';
import { getOrders, getMyClubMembership } from './utils/storage';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { AboutMe } from './components/AboutMe';
import { CardOfTheDay } from './components/CardOfTheDay';
import { ClubArcanaBanner } from './components/ClubArcanaBanner';
import { ClubModal } from './components/ClubModal';
import { WheelOfFortune } from './components/WheelOfFortune';
import { ServiceShowcase } from './components/ServiceShowcase';
import { ImportantInfo } from './components/ImportantInfo';
import { BookingModal } from './components/BookingModal';
import { SuccessScreen } from './components/SuccessScreen';
import { AdminPanel } from './components/AdminPanel';
import { MyOrdersModal } from './components/MyOrdersModal';
import { DigitalGoodsReaderModal } from './components/DigitalGoodsReaderModal';
import { DemoPaymentModal } from './components/DemoPaymentModal';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';

export default function App() {
  const [activeMobileTab, setActiveMobileTab] = useState<'services' | 'card' | 'club' | 'wheel' | 'orders' | 'admin'>('services');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isClubOpen, setIsClubOpen] = useState(false);

  const [selectedService, setSelectedService] = useState<TarotService | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriodOption | undefined>(undefined);

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [readingDigitalOrder, setReadingDigitalOrder] = useState<Order | null>(null);
  const [isDigitalReaderOpen, setIsDigitalReaderOpen] = useState(false);

  // Club Membership
  const [myMembership, setMyMembership] = useState<ClubMember | null>(() => getMyClubMembership());

  // Demo Payment Modal for generic or club operations
  const [demoPayState, setDemoPayState] = useState<{
    isOpen: boolean;
    amount: number;
    title: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    amount: 0,
    title: '',
    onConfirm: () => {},
  });

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
    setMyMembership(getMyClubMembership());
  }, [completedOrder, isBookingOpen, isAdminOpen, isClubOpen]);

  const scrollToSection = (sectionId: string) => {
    if (completedOrder) {
      setCompletedOrder(null);
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectService = (service: TarotService, period?: TimePeriodOption) => {
    setSelectedService(service);
    setSelectedPeriod(period);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (order: Order) => {
    setIsBookingOpen(false);
    setCompletedOrder(order);
    setOrders(getOrders());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrizeClaimed = (prize: WheelPrize) => {
    scrollToSection('services-section');
  };

  const handleOpenDigitalGood = (order: Order) => {
    setReadingDigitalOrder(order);
    setIsDigitalReaderOpen(true);
  };

  const handleRequestDemoPay = (amount: number, title: string, onConfirm: () => void) => {
    setDemoPayState({
      isOpen: true,
      amount,
      title,
      onConfirm,
    });
  };

  const handleSelectMobileTab = (tab: string) => {
    setActiveMobileTab(tab as any);
    if (completedOrder) setCompletedOrder(null);

    switch (tab) {
      case 'services':
        scrollToSection('services-section');
        break;
      case 'card':
        scrollToSection('card-section');
        break;
      case 'club':
        setIsClubOpen(true);
        break;
      case 'wheel':
        scrollToSection('wheel-section');
        break;
      case 'orders':
        setIsMyOrdersOpen(true);
        break;
      case 'admin':
        setIsAdminOpen(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] flex flex-col selection:bg-[#FAFAF9] selection:text-[#0C0A09] pb-20 md:pb-0 font-sans">
      
      {/* Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onOpenClub={() => setIsClubOpen(true)}
        onScrollToSection={scrollToSection}
        ordersCount={orders.length}
        hasClubMembership={Boolean(myMembership?.isActive)}
      />

      {/* Main Magazine Body Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-5 sm:pt-8">
        
        {completedOrder ? (
          <SuccessScreen
            order={completedOrder}
            onBackToHome={() => setCompletedOrder(null)}
            onOpenDigitalGood={handleOpenDigitalGood}
            onViewMyOrders={() => {
              setCompletedOrder(null);
              setIsMyOrdersOpen(true);
            }}
          />
        ) : (
          <div className="space-y-12 sm:space-y-16">
            
            {/* 1. Fashion Editorial & Digital Collage Hero Banner with Welcome Greeting */}
            <HeroBanner
              onExploreServices={() => scrollToSection('services-section')}
              onExploreDailyCard={() => scrollToSection('card-section')}
              onExploreClub={() => setIsClubOpen(true)}
            />

            {/* 2. Block: "ОБО МНЕ" (Editorial spread, 2 columns, +300 clients, collage frame) */}
            <div id="about-section">
              <AboutMe />
            </div>

            {/* 3. Feature 1: Карта дня (Magazine Cutout Collage) */}
            <div id="card-section" className="scroll-mt-20">
              <CardOfTheDay
                onSelectServiceForCard={(serviceId) => {
                  const s = TAROT_SERVICES.find((serv) => serv.id === serviceId);
                  if (s) handleSelectService(s);
                }}
              />
            </div>

            {/* 4. Feature 2: Клуб Arcana (990 ₽/мес) Editorial Banner */}
            <div id="club-banner-section">
              <ClubArcanaBanner
                onOpenClub={() => setIsClubOpen(true)}
                myMembership={myMembership}
              />
            </div>

            {/* 5. Feature 3: Колесо Фортуны (Vintage B&W Dial Chronometer) */}
            <div id="wheel-section" className="scroll-mt-20">
              <WheelOfFortune onPrizeClaimed={handlePrizeClaimed} />
            </div>

            {/* 6. Core Services Showcase (Magazine Catalogue Index with hairlines & exact prices) */}
            <div id="services-section" className="scroll-mt-20">
              <ServiceShowcase onSelectService={handleSelectService} />
            </div>

            {/* 7. Block: "О ВАЖНОМ" */}
            <div className="pt-2">
              <ImportantInfo />
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeMobileTab}
        onSelectTab={handleSelectMobileTab}
        ordersCount={orders.length}
        hasClubMembership={Boolean(myMembership?.isActive)}
      />

      {/* Booking Modal (Strict Boutique Style & Exact Demo Payment) */}
      {selectedService && (
        <BookingModal
          service={selectedService}
          selectedPeriod={selectedPeriod}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedService(null);
            setSelectedPeriod(undefined);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Club Arcana Modal (Personal Cabinet, Emergency Question & Checklists) */}
      <ClubModal
        isOpen={isClubOpen}
        onClose={() => setIsClubOpen(false)}
        membership={myMembership}
        onMembershipUpdated={(m) => setMyMembership(m)}
        onRequestDemoPay={handleRequestDemoPay}
      />

      {/* Hidden Admin Panel (PIN: 7777, Slots, Daily Cards, Club Subscribers & Mass Dispatch) */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => {
            setIsAdminOpen(false);
            setOrders(getOrders());
            setMyMembership(getMyClubMembership());
          }}
        />
      )}

      {/* My Orders History & Audio Player Modal */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        onOpenDigitalGood={handleOpenDigitalGood}
        onOpenClub={() => setIsClubOpen(true)}
      />

      {/* Digital Good Reader & Downloader */}
      <DigitalGoodsReaderModal
        order={readingDigitalOrder}
        isOpen={isDigitalReaderOpen}
        onClose={() => {
          setIsDigitalReaderOpen(false);
          setReadingDigitalOrder(null);
        }}
      />

      {/* Generic Demo Payment Modal */}
      <DemoPaymentModal
        isOpen={demoPayState.isOpen}
        onClose={() => setDemoPayState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={demoPayState.onConfirm}
        amount={demoPayState.amount}
        itemName={demoPayState.title}
      />

    </div>
  );
}
