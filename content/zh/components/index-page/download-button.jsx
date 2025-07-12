'use client'

import { useEffect, useState } from 'react'
import { Button, HStack, VStack, Text } from '@chakra-ui/react'
import { FaApple } from "react-icons/fa6";
import { LuGrid2X2, LuArrowDownToLine } from "react-icons/lu";

const DOWNLOAD_LINKS = {
  win32: { label: '下载 Windows (32位) 版', icon: <LuGrid2X2 /> },
  win64: { label: '下载 Windows (64位) 版', icon: <LuGrid2X2 /> },
  macos_arm: { label: '下载 macOS (Apple Silicon) 版', icon: <FaApple /> },
  macos_intel: { label: '下载 macOS (Intel) 版', icon: <FaApple /> },
  linux: { label: '下载 Linux 版', icon: <LuArrowDownToLine /> },
  fallback: { label: '下载', icon: <LuArrowDownToLine /> },
}

export default function DownloadButton() {
  const [download, setDownload] = useState(DOWNLOAD_LINKS.fallback)

  useEffect(() => {
    const platform = navigator.platform.toLowerCase()
    const ua = navigator.userAgent.toLowerCase()

    if (platform.includes('win')) {
      if (ua.includes('x64') || ua.includes('win64') || ua.includes('wow64')) {
        setDownload(DOWNLOAD_LINKS.win64)
      } else {
        setDownload(DOWNLOAD_LINKS.win32)
      }
    } else if (platform.includes('mac')) {
      if (ua.includes('arm') || ua.includes('aarch64') || ua.includes('apple')) {
        setDownload(DOWNLOAD_LINKS.macos_arm)
      } else {
        setDownload(DOWNLOAD_LINKS.macos_intel)
      }
    } else if (platform.includes('linux')) {
      setDownload(DOWNLOAD_LINKS.linux)
    }
  }, [])

  return (
    <VStack spacing={2}>
      <Button colorScheme="blue" size="lg" leftIcon={download.icon}>
        {download.label}
      </Button>
      <HStack
        divider={
          <Text fontSize="sm" mx={1} className='secondary-text'>
          ·
          </Text>
        }
      >
        <Text fontSize="sm" className='secondary-text'>
          最新版本 0.0.1
        </Text>
        <Button variant="link" size="sm" fontWeight="normal">
          全部版本
        </Button>
      </HStack>
    </VStack>
  )
}