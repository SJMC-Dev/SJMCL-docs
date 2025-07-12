import { ColorModeSyncWrapper } from './components/color-mode-wrapper'
import './styles/global.css'

export default function RootLayout({ children }) {
  return (
    <ColorModeSyncWrapper>
      {children}
    </ColorModeSyncWrapper>
  )
}
