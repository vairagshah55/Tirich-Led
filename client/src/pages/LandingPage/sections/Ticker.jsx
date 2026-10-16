import { TICKER } from '../homeContent';
import styles from './Ticker.module.css';

/**
 * The orange marquee under the hero. The list is rendered twice and the
 * track slides by exactly half its width, so the loop has no seam; the copy
 * is hidden from assistive tech so the list is announced once.
 */
export default function Ticker() {
  return (
    <div className={styles.ticker}>
      <div className={styles.track}>
        <ul className={styles.list}>
          {TICKER.map((t) => (
            <li key={t} className={styles.item}>{t}</li>
          ))}
        </ul>
        <ul className={styles.list} aria-hidden="true">
          {TICKER.map((t) => (
            <li key={t} className={styles.item}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
