/* App composition + global scroll reveal */

function App() {
  useReveal();
  return (
    <React.Fragment>
      <Background />
      <Nav />
      <main id="main">
        <Hero />
        <Bus label="DATA BUS · AHB" />
        <Features />
        <Release201 />
        <ProductScreenshots />
        <Bus label="IRQ · NVIC" flip={true} />
        <AgentOrbit />
        <Bus label="SWD · JTAG" />
        <MCU />
        <Bus label="TRACE · ETM" flip={true} />
        <TraceGraph />
        <Bus label="GRAPH · RPC" />
        <GraphShowcase />
        <Bus label="PWR · 3V3" />
        <Download />
        <Footer />
      </main>
      <Telemetry />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
