import { memo } from 'react'
import styles from './header.module.scss'
import { TemplateSelect } from '@/features/templates'

export const Header = memo(() => {
    return (
        <header className={styles['header']}>
            <div className='container'>
                <div className={styles['inner']}>
                    <TemplateSelect />
                </div>
            </div>
        </header>
    )
})