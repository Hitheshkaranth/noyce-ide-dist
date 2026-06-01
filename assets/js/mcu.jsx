/* Rotating 3D MCU — glowing pins, click/hover reveals pin detail cards */

const PINS = [
  { id: 'PA9',  side: 'top',    pos: 30, fn: 'USART1_TX', alt: 'AF7', volt: 'VDD 3.3V', periph: 'USART1', status: 'resolved' },
  { id: 'PB6',  side: 'top',    pos: 62, fn: 'I2C1_SCL',  alt: 'AF4', volt: 'VDD 3.3V', periph: 'I2C1',   status: 'resolved' },
  { id: 'PC13', side: 'right',  pos: 30, fn: 'GPIO_EXTI', alt: 'EXTI13', volt: 'VBAT', periph: 'EXTI',   status: 'resolved' },
  { id: 'PD12', side: 'right',  pos: 66, fn: 'TIM4_CH1',  alt: 'AF2', volt: 'VDD 3.3V', periph: 'TIM4',   status: 'review' },
  { id: 'PA0',  side: 'bottom', pos: 40, fn: 'ADC1_IN0',  alt: 'ANALOG', volt: 'VREF+', periph: 'ADC1',  status: 'resolved' },
  { id: 'PE2',  side: 'left',   pos: 50, fn: 'SAI1_MCLK', alt: 'AF6', volt: 'VDD 3.3V', periph: 'SAI1',   status: 'conflict' },
];

function decorativePins() {
  const sides = ['top', 'right', 'bottom', 'left'];
  const arr = [];
  sides.forEach((side) => {
    for (let i = 0; i < 9; i++) arr.push({ side, pos: 12 + i * 9.5, deco: true });
  });
  return arr;
}

function pinStyle(side, pos) {
  const off = -10;
  if (side === 'top') return { top: off, left: pos + '%' };
  if (side === 'bottom') return { bottom: off, left: pos + '%' };
  if (side === 'left') return { left: off, top: pos + '%', width: 6, height: 16 };
  return { right: off, top: pos + '%', width: 6, height: 16 };
}

const PACKAGES = [
  { name: 'STM32H743', pkg: 'LQFP176', cls: 'lqfp' },
  { name: 'i.MX RT1170', pkg: 'BGA289', cls: 'bga' },
  { name: 'RP2040', pkg: 'QFN56', cls: 'qfn' },
  { name: 'PIC32MZ', pkg: 'TQFP100', cls: 'tqfp' },
  { name: 'MSP430FR', pkg: 'SOIC20', cls: 'soic' },
  { name: 'PIC16F', pkg: 'DIP28', cls: 'dip' },
];

function Packages() {
  return (
    <div className="reveal d2" style={{ marginTop: 64 }}>
      <div className="pkg-head">
        <span className="pkg-kicker">Package-aware</span>
        <span className="rule" />
        <span className="chip ice"><span className="dot" />6 footprints · pin-mapped</span>
      </div>
      <div className="pkg-grid">
        {PACKAGES.map((p, i) => (
          <div className="pkg-tile glass board" key={p.name}>
            <span className="corner-pad tl" /><span className="corner-pad tr" /><span className="corner-pad bl" /><span className="corner-pad br" />
            <span className="silk" style={{ top: 8, right: 10 }}>{'IC' + (i + 1)}</span>
            <div className="pkg-stage">
              <div className={'pkg ' + p.cls}>
                <span className="pnotch" />
                <span className="leg top" /><span className="leg right" /><span className="leg bottom" /><span className="leg left" />
                <span className="pdie" />
              </div>
            </div>
            <div className="pkg-cap"><b>{p.name}</b><span>{p.pkg}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MCU() {
  const [active, setActive] = useState('PA9');
  const a = PINS.find((p) => p.id === active);
  const statusChip = { resolved: 'ok', review: 'warn', conflict: 'warn' };
  const features = [
    { ico: 'pin', h: 'Pin mux that knows the board', p: 'Drag a peripheral onto the chip and Noyce resolves the alternate function, conflicts, and pin-level electrical constraints in real time, then exports HAL init, device-tree, or AUTOSAR ECU config.', c: 'PA9=USART1_TX · alt-fn 7 · drive=high · resolved' },
    { ico: 'reg', h: 'Peripheral registers, SVD-aware', p: 'Hover any MMIO write to see the register, its fields, reset value, and access semantics — pulled straight from the vendor SVD. Bitfield ranges and read-modify-write traps surface inline.', c: 'RCC->AHB1ENR = RCC_AHB1ENR_GPIOAEN;' },
    { ico: 'rtos', h: 'RTOS task viewer', p: 'Live task list, stack high-watermark, and deadline misses for FreeRTOS, Zephyr, and ThreadX over SWD or J-Link.', c: 'task_safety · prio 31 · RUNNING' },
    { ico: 'fault', h: 'Cortex-M fault decoder', p: 'HardFault, BusFault, MemManage, and UsageFault decoded from CFSR/HFSR with the stacked frame walked back to source.', c: 'UsageFault: UNDEFINSTR @ 0x0801F2A4' },
    { ico: 'mem', h: 'Linker memory map', p: 'Visualises FLASH, SRAM, CCM, and external regions, and flags overflows before the link fails. Per-symbol cost included.', c: 'FLASH 612K / 2M · SRAM 128K / 512K · ok' },
  ];
  const targets = ['STM32', 'TI Tiva', 'PIC32', 'RP2040', 'i.MX RT', 'Cortex-M'];

  return (
    <section className="section-pad" id="hardware">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="kicker">Noyce Hardware</span>
          <h2>The editor reads the datasheet<br />so you don't have to.</h2>
          <p>First-class support for STM32, TI Tiva, Microchip PIC32, Raspberry Pi RP2040, NXP i.MX RT, and generic Cortex-M. The hardware surfaces stay in the workbench, next to the code that drives them.</p>
          <div className="mcu-targets">
            {targets.map((t) => <span className="chip ice" key={t}><span className="dot" />{t}</span>)}
          </div>
        </div>

        <div className="mcu-wrap reveal d1">
          {/* Chip stage */}
          <div className="mcu-stage">
            <div className="mcu-tilt">
              <div className="chip">
                <span className="notch" />
                <div className="die"><div className="mark"><b>STM32H743</b>Cortex-M7 · 480 MHz<br />LQFP176</div></div>
                <span className="silk" style={{ top: 6, right: 12, color: 'rgba(125,211,252,0.45)' }}>U1</span>
                {decorativePins().map((p, i) => (
                  <span key={'d' + i} className={'pin' + (i % 3 === 0 ? ' gold' : '')} style={pinStyle(p.side, p.pos)} />
                ))}
                {PINS.map((p) => (
                  <span key={p.id}
                    className={'pin live' + (active === p.id ? ' active' : '')}
                    style={pinStyle(p.side, p.pos)}
                    onMouseEnter={() => setActive(p.id)}
                    onClick={() => setActive(p.id)}>
                    <span className="pulse" />
                  </span>
                ))}
              </div>
            </div>

            {/* Fixed-position pin detail card (readable regardless of 3D) */}
            <div className="pin-card" style={{ top: 8, right: 0 }}>
              <div className="pc-name">{a.id} · {a.fn}</div>
              <div className="pc-rows">
                <div className="pc-row"><span className="k">alternate fn</span><span className="v">{a.alt}</span></div>
                <div className="pc-row"><span className="k">voltage domain</span><span className="v">{a.volt}</span></div>
                <div className="pc-row"><span className="k">peripheral</span><span className="v">{a.periph}</span></div>
                <div className="pc-row"><span className="k">validation</span>
                  <span className="v" style={{ color: a.status === 'conflict' ? 'var(--amber)' : a.status === 'review' ? 'var(--amber)' : 'var(--green)' }}>{a.status}</span></div>
              </div>
            </div>

            {/* floating register card */}
            <div className="reg-card" style={{ position: 'absolute', bottom: 14, left: 0 }}>
              <Ico.reg style={{ width: 14, height: 14, color: 'var(--violet)' }} />
              RCC-&gt;AHB1ENR <span style={{ color: 'var(--ice)' }}>|= GPIOAEN</span>
            </div>
          </div>

          {/* Feature list */}
          <div>
            {features.map((f, i) => {
              const FIco = Ico[f.ico];
              return (
                <div className="mcu-feature" key={i}>
                  <span className="mf-ico"><FIco /></span>
                  <div>
                    <h4>{f.h}</h4>
                    <p>{f.p}</p>
                    <code className="mf-code">{f.c}</code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Packages />
      </div>
    </section>
  );
}

Object.assign(window, { MCU });
