"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, Logo } from "@/components/Icons";
import {useRouter} from "next/navigation";

export const Navbar = () => {
  const [connected, setConnected] = useState(false);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // 读取钱包地址
  useEffect(() => {
    const storedAddress = localStorage.getItem("address");
    if (storedAddress) {
      setWalletAddress(storedAddress);
      setConnected(true);
    }

    // 监听账户变化
    const handleAccountsChanged = (accounts: unknown) => {
      if (Array.isArray(accounts) && accounts.length > 0) {
        const address = accounts[0] as string; // 类型断言
        setWalletAddress(address);
        localStorage.setItem("address", address);
      } else {
        handleSignOut(); // 如果没有账户，注销
      }
    };

    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    // 清理函数，当组件卸载时移除事件监听
    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);


  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts: string[] = await window.ethereum.request({
          method: "eth_requestAccounts",
        }) as string[];
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          setConnected(true);
          localStorage.setItem("address", address);
        } else {
          console.error("No accounts found");
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.log("MetaMask is not installed!");
    }
  };

  const handleMouseEnter = () => {
    if (connected) {
      setIsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleIdeasPage = ()=>{
    router.push("ideas")
  }

  const handleSignOut = () => {
    setWalletAddress(null);
    setConnected(false);
    localStorage.removeItem("address");
    if (typeof window.ethereum !== "undefined") {
      console.log("Disconnected from wallet.");
    }
  };

  return (
      <NextUINavbar maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink className="flex justify-start items-center gap-1" href="/">
              <Logo />
              <p className="font-bold text-inherit ml-3">HAVEANIDEA</p>
            </NextLink>
          </NavbarBrand>
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
                <NavbarItem key={item.href}>
                  <NextLink
                      className={clsx(
                          linkStyles({ color: "foreground" }),
                          "data-[active=true]:text-primary data-[active=true]:font-medium",
                      )}
                      color="foreground"
                      href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
          <NavbarItem className="hidden sm:flex gap-2">
            <Link isExternal aria-label="Github" href={siteConfig.links.github}>
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="hidden md:flex dropdown relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Button className="text-sm font-normal text-default-600 bg-default-100" onClick={connectWallet}>
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "CONNECT"}
            </Button>
            {connected && isDropdownOpen && (
                <div className="absolute z-10 border border-white bg-default-100 shadow-lg rounded mt-10 right-0 w-40">
                  <div className="border-t border-gray-300 opacity-50" style={{ height: '1px' }} /> {/* 横线紧接按钮 */}
                  <Link onClick={handleIdeasPage}
                      className="block w-full text-xs text-left px-4 py-2 hover:bg-gray-200 transition duration-200"
                  >
                    Ideas
                  </Link>
                  <div className="border-t border-gray-300 opacity-50" style={{ height: '1px' }} /> {/* 横线紧接按钮 */}
                  <Link
                      color="danger"
                      onClick={handleSignOut}
                      className="block w-full text-xs text-left px-4 py-2 hover:bg-gray-200 transition duration-200"
                  >
                    Sign Out
                  </Link>
                </div>
            )}
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>
      </NextUINavbar>
  );
};