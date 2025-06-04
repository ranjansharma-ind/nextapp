export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div>   
            {children}
            <div><h1>
            </h1>Featurd production section</div>
        </div>
    );
}