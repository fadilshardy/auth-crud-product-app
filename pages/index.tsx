import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useSession, signIn, signOut } from "next-auth/react"
import Sidebar from '../src/components/Sidebar/Sidebar'
import { AppShell } from '@mantine/core';
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { CompactTable } from '@table-library/react-table-library/compact';
import DataTable from '../src/components/DataTable/DataTable'
import * as productsApi from '../src/lib/productsApi'
import { useEffect, useState } from 'react'
import axios from 'axios';
import client from '../src/lib/apiClient';
import { Product } from '../src/types/Product'

interface IHomeProps {
  products: Product[]
}

const Home: NextPage<IHomeProps> = ({ products }) => {
  const [opened, setOpened] = useState(false);


  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Sidebar />
      }>
      <DataTable products={products} />
    </AppShell>
  )
}

export default Home;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // @ts-ignore
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  if (session) {
    client.interceptors.request.use(async (config) => {
      // @ts-ignore
      config.headers.Authorization = `Bearer ${session.user.token}`;
      return config;
    });

    const products = await productsApi.getProducts();
    return {
      props: {
        session,
        products: products
      },
    }
  }
}


