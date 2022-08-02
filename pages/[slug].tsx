import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { Welcome } from '../types/types'
import MoneyInput from '@rschpdr/react-money-input'
//Jjsimport axios from 'axios'

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const fetchData = async () => {
  const response = await fetch(
    'http://localhost:3000/api/ipca'
    //'https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/63/p/all/d/v63%202'
  )
  //const ipcas = data as Welcome[]
  const ipcas = (await response.json()) as Welcome[]
  ipcas.shift()
  return ipcas
}

const Home: NextPage = (props: any) => {
  const { valorInicial:valorInicialPath ,anoInicial, ipcasPreload } = props
  const [ipcas, setIpcas] = useState(ipcasPreload as Welcome[])
  const [valorInicial, setValorInicial] = useState(valorInicialPath)
  const [inicioMes, setInicioMes] = useState('01')
  const [inicioAno, setInicioAno] = useState(anoInicial)
  const [fimMes, setFimMes] = useState('03')
  const [fimAno, setFimAno] = useState('2022')
  const loadData = async () => {
    const ipcas = await fetchData()
    setIpcas(ipcas)
  }
  useEffect(() => {
    loadData()
  }, [])

  const inicio = ipcas.findIndex((ipca) => ipca.D3C == inicioAno + inicioMes)
  const fim = ipcas.findIndex((ipca) => ipca.D3C == fimAno + fimMes)
  let ipcasSelecionados
  if (inicio <= fim) {
    ipcasSelecionados = ipcas.slice(inicio, fim + 1)
  } else {
    ipcasSelecionados = ipcas.slice(fim, inicio + 1)
  }
  const acumulado = ipcasSelecionados
    .map((ipca) => {
      if (inicio <= fim) {
        return 1 + Number(ipca.V) / 100
      } else {
        return 1 - Number(ipca.V) / 100
      }
    })
    .reduce((acc, ipca) => {
      return acc * ipca
    }, 1)
  const anos = Array.from(
    new Set(
      ipcas.map((ipca) => {
        return ipca.D3C.substring(0, 4)
      })
    )
  )

  const anosOptions = Array.from(anos).map((ano) => (
    <option key={ano} value={ano}>
      {ano}
    </option>
  ))

  const mesesInicioDisponiveis = ipcas.filter((ipca) =>
    ipca.D3C.includes(inicioAno)
  ).length

  const mesesFimDisponiveis = ipcas.filter((ipca) =>
    ipca.D3C.includes(fimAno)
  ).length

  const mesesOptions = MESES.map((mes, i) => (
    <option key={i} value={(i + 1).toString().padStart(2, '0')}>
      {mes}
    </option>
  ))

  return (
    <div className={styles.container}>
      <Head>{''}</Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Bem Vindo</h1>

        <p className={styles.description}>Calcule o valor reajustado de:</p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>
              Valor em{' '}
              <select
                value={inicioMes}
                onChange={(e) => setInicioMes(e.target.value.toString())}
              >
                {mesesOptions.slice(0, mesesInicioDisponiveis)}
              </select>
              de{' '}
              <select
                value={anoInicial}
                onChange={(e) => setInicioAno(e.target.value.toString())}
              >
                {anosOptions}
              </select>
              :
            </h2>
            <p>
              <MoneyInput
                value={valorInicial}
                onChange={(e: any) => setValorInicial(Number(e.target.value))}
                type='number'
              ></MoneyInput>{' '}
            </p>
          </div>

          <div className={styles.card}>
            <h2>
              Valor em{' '}
              <select
                value={fimMes}
                onChange={(e) => setFimMes(e.target.value.toString())}
              >
                {mesesOptions.slice(0, mesesFimDisponiveis)}
              </select>
              de{' '}
              <select
                value={fimAno}
                onChange={(e) => setFimAno(e.target.value.toString())}
              >
                {anosOptions}
              </select>
              :
            </h2>

            <p> {(valorInicial * acumulado).toFixed(2)} </p>
          </div>
        </div>
        <div>
          {valorInicial} reais em {inicioAno} equivalem a{' '}
          {(valorInicial * acumulado).toFixed(2)} reais Hoje
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
export const getStaticProps: GetStaticProps = async (context) => {
  const ipcasPreload = await fetchData()
  console.log('context',context)
  const slug = context?.params?.slug as string
  const slugArr = slug?.split('-')
  const valorInicial = slugArr[0]
  const anoInicial = slugArr[slugArr.length-1]
  return {
    props: {
      valorInicial,
      anoInicial,
      ipcasPreload,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ipcas = await fetchData()
  const anos = Array.from(
    new Set(
      ipcas.map((ipca) => {
        return ipca.D3C.substring(0, 4)
      })
    )
  ) as string[]
  const valoresIniciais = ['100', '1000']

  const paths = []

  for (let i = 0; i < anos.length; i++) {
    const ano = anos[i]
    for (let j = 0; j < valoresIniciais.length; j++) {
      const valor = valoresIniciais[j]

      const slug = `${valor}-reais-em-${ano}`
      paths.push({ params: { slug} })
    }
  }

  return { paths, fallback: 'blocking' }
}

export default Home
