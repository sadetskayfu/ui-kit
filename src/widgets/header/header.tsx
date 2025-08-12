import { memo } from 'react'
import styles from './header.module.scss'


export const Header = memo(() => {
    return (
        <header className={styles['header']}>
            <div className='container'>
                <div className={styles['inner']}>
                    
                </div>
            </div>
        </header>
    )
})