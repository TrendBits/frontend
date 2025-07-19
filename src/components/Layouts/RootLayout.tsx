interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className = "" }: LayoutProps) => {
  return <div className={`bg-mainBg min-w-dvw min-h-dvh ${className}`}>{children}</div>;
};

export default Layout;
