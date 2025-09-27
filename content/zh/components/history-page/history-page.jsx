"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Link as CLink,
} from "@chakra-ui/react";
import { LuArrowDownToLine } from "react-icons/lu";

const API = "https://api.github.com/repos/UnikeEN/SJMCL/releases";
const MC_BASE = "https://mc.sjtu.cn/sjmcl/releases/";

function inferMeta(name) {
  const n = name.toLowerCase();
  let os = "other";
  if (/win|windows/.test(n)) os = "Windows";
  else if (/mac|macos|darwin/.test(n)) os = "macOS";
  else if (/linux/.test(n)) os = "Linux";

  let arch = "-";
  if (/aarch64|arm64/.test(n)) arch = "aarch64";
  else if (/x86_64|x64/.test(n)) arch = "x86_64";
  else if (/(i386|i686|x86)(?!_64)/.test(n)) arch = "i686";

  let type = "file";
  if (/portable/i.test(n)) type = "portable";
  else if (/\.dmg$/i.test(n)) type = "dmg";
  else if (/\.msi$/i.test(n)) type = "msi";
  else if (/\.exe$/i.test(n)) type = "exe";
  else if (/\.appimage$/i.test(n)) type = "AppImage";
  else if (/\.deb$/i.test(n)) type = "deb";
  else if (/\.rpm$/i.test(n)) type = "rpm";
  else if (/\.tar\.gz$/i.test(n)) type = "tar.gz";
  else if (/\.zip$/i.test(n)) type = "zip";
  else if (/\.app\.tar\.gz$/i.test(n)) type = "app.tar.gz";

  return { os, arch, type };
}

function humanSize(bytes) {
  if (typeof bytes !== "number") return "-";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0,
    s = bytes;
  while (s >= 1024 && i < units.length - 1) {
    s /= 1024;
    i++;
  }
  const v =
    s < 10 && i > 0 ? s.toFixed(2) : s < 100 ? s.toFixed(1) : Math.round(s);
  return `${v} ${units[i]}`;
}

function shouldHighlightRow({ os, arch, name }) {
  const n = (name || "").toLowerCase();
  const isWinPortableExe =
    os === "Windows" &&
    arch === "x86_64" &&
    /portable/i.test(n) &&
    /\.exe$/i.test(n);

  const isMacArmDmg = os === "macOS" && arch === "aarch64" && /\.dmg$/i.test(n);

  return isWinPortableExe || isMacArmDmg;
}

export default function History() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    releases: [],
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(API, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (alive) setState({ loading: false, error: "", releases: json });
      } catch (e) {
        if (alive)
          setState({ loading: false, error: "获取历史版本失败", releases: [] });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (state.loading)
    return (
      <HStack>
        <Spinner />
        <Text>正在获取历史版本…</Text>
      </HStack>
    );
  if (state.error) return <Text>{state.error}</Text>;

  const rows = state.releases
    .flatMap((release) => {
      const tag = release.tag_name || "";
      const files = (release.assets || []).map((a) => ({
        name: a.name,
        size: a.size,
        url: a.browser_download_url,
      }));
      return files.map((f) => {
        const name = f.name || "";
        const size = f.size;
        const { os, arch, type } = inferMeta(name);
        const url = f.url || MC_BASE + encodeURIComponent(name);
        return {
          tag,
          name,
          size,
          os,
          arch,
          type,
          url,
          published_at: release.published_at,
          prerelease: release.prerelease,
        };
      });
    })
    .sort((a, b) => {
      if (a.tag !== b.tag)
        return a.tag.localeCompare(b.tag, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      const osOrder = { Windows: 1, macOS: 2, Linux: 3, other: 99 };
      const archOrder = {
        portable: 1,
        x86_64: 2,
        aarch64: 3,
        i686: 4,
        "-": 99,
      };
      const osDiff = (osOrder[a.os] || 99) - (osOrder[b.os] || 99);
      if (osDiff !== 0) return osDiff;
      const archDiff = (archOrder[a.arch] || 99) - (archOrder[b.arch] || 99);
      if (archDiff !== 0) return archDiff;
      return a.name.localeCompare(b.name);
    });

  const groups = [];
  // group by tag (version)
  const tagMap = state.releases.reduce((m, r) => {
    (m[r.tag_name] ||= []).push(r);
    return m;
  }, {});

  const orderedTags = Object.keys(tagMap);

  return (
    <VStack align="stretch" spacing={4}>
      {rows.length === 0 ? (
        <Box>
          <Text>暂无历史版本文件。</Text>
        </Box>
      ) : (
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>版本</Th>
              <Th>平台</Th>
              <Th>架构</Th>
              <Th>文件</Th>
              <Th>大小</Th>
              <Th>下载</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((r) => (
              <Tr key={`${r.tag}-${r.name}`}>
                <Td>{r.tag}</Td>
                <Td>{r.os}</Td>
                <Td>{r.arch}</Td>
                <Td>
                  <CLink href={r.url} isExternal>
                    {r.name}
                  </CLink>
                </Td>
                <Td>{humanSize(r.size)}</Td>
                <Td>
                  <Button
                    as="a"
                    href={r.url}
                    size="sm"
                    leftIcon={<LuArrowDownToLine />}
                  >
                    下载
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </VStack>
  );
}
