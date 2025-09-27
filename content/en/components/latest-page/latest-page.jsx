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

const API = "https://mc.sjtu.cn/api-sjmcl/releases/latest";
const MC_BASE = "https://mc.sjtu.cn/sjmcl/releases/";

const osOrder = { Windows: 1, macOS: 2, Linux: 3, other: 99 };
const archOrder = { portable: 1, x86_64: 2, aarch64: 3, i686: 4, "-": 99 };

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

export default function Latest() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    version: "",
    files: [],
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(API, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const version = (json.version || "").toString();
        const files = Array.isArray(json.files) ? json.files : [];
        if (alive) setState({ loading: false, error: "", version, files });
      } catch (e) {
        if (alive)
          setState({
            loading: false,
            error: "Failed to fetch latest release",
            version: "",
            files: [],
          });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (state.loading) {
    return (
      <HStack>
        <Spinner />
        <Text>Fetching latest release…</Text>
      </HStack>
    );
  }
  if (state.error) {
    return <Text>{state.error}</Text>;
  }

  const rows = state.files
    .map((f) => {
      const name = f.name || "";
      const size = f.size;
      const { os, arch, type } = inferMeta(name);
      const url = MC_BASE + encodeURIComponent(name);
      return { name, size, os, arch, type, url };
    })
    .sort((a, b) => {
      const osDiff = (osOrder[a.os] || 99) - (osOrder[b.os] || 99);
      if (osDiff !== 0) return osDiff;
      const archDiff = (archOrder[a.arch] || 99) - (archOrder[b.arch] || 99);
      if (archDiff !== 0) return archDiff;
      return a.name.localeCompare(b.name);
    });

  const groups = Object.keys(osOrder)
    .map((os) => {
      const itemsOfOs = rows.filter((r) => r.os === os);
      if (itemsOfOs.length === 0) return null;
      const archMap = itemsOfOs.reduce((m, r) => {
        (m[r.arch] ||= []).push(r);
        return m;
      }, /** @type {Record<string, typeof itemsOfOs>} */ ({}));
      const archGroups = Object.entries(archMap)
        .sort((a, b) => (archOrder[a[0]] || 99) - (archOrder[b[0]] || 99))
        .map(([arch, items]) => ({ arch, items }));
      const rowCount = archGroups.reduce((sum, g) => sum + g.items.length, 0);
      return { os, rowCount, archGroups };
    })
    .filter(Boolean);

  return (
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between">
        {state.version && <Badge colorScheme="blue">v{state.version}</Badge>}
      </HStack>

      {rows.length === 0 ? (
        <Box>
          <Text>This release does not contain any files.</Text>
        </Box>
      ) : (
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Platform</Th>
              <Th>Arch</Th>
              <Th>File</Th>
              <Th>Size</Th>
              <Th>Download</Th>
            </Tr>
          </Thead>
          <Tbody>
            {groups.map((osGroup) =>
              osGroup.archGroups.flatMap((ag, agIdx) =>
                ag.items.map((r, idx) => {
                  const highlight = shouldHighlightRow({
                    os: osGroup.os,
                    arch: ag.arch,
                    name: r.name,
                  });
                  return (
                    <Tr key={`${osGroup.os}-${ag.arch}-${r.name}`}>
                      {agIdx === 0 && idx === 0 && (
                        <Td rowSpan={osGroup.rowCount}>{osGroup.os}</Td>
                      )}
                      {idx === 0 && (
                        <Td rowSpan={ag.items.length}>{ag.arch}</Td>
                      )}

                      <Td bg={highlight ? "yellow.50" : undefined}>
                        <CLink href={r.url} isExternal>
                          {r.name}
                        </CLink>
                      </Td>
                      <Td bg={highlight ? "yellow.50" : undefined}>
                        {humanSize(r.size)}
                      </Td>
                      <Td bg={highlight ? "yellow.50" : undefined}>
                        <Button
                          as="a"
                          href={r.url}
                          size="sm"
                          leftIcon={<LuArrowDownToLine />}
                        >
                          Download
                        </Button>
                      </Td>
                    </Tr>
                  );
                })
              )
            )}
          </Tbody>
        </Table>
      )}
    </VStack>
  );
}
