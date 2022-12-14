import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { Welcome } from '../types/types'
import MoneyInput from "@rschpdr/react-money-input";

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

const Home: NextPage = () => {
  const [ipcas, setIpcas] = useState([] as Welcome[])
  const [valorInicial, setValorInicial] = useState(1000)
  const [inicioMes, setInicioMes] = useState('01')
  const [inicioAno, setInicioAno] = useState('2008')
  const [fimMes, setFimMes] = useState('03')
  const [fimAno, setFimAno] = useState('2022')
  const fetchData = async () => {
    const response = await fetch(
      'https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/63/p/all/d/v63%202'
    )
    const ipcas = (await response.json()) as Welcome[]
    console.log(ipcas[1].V)
    ipcas.shift()
    setIpcas(ipcas)
  }
  useEffect(() => {
    fetchData()
  }, [])

  const inicio = ipcas.findIndex((ipca) => ipca.D3C == inicioAno + inicioMes)
  console.log('inicio', inicio)
  const fim = ipcas.findIndex((ipca) => ipca.D3C == fimAno + fimMes)
  console.log('fim', fim)
  let ipcasSelecionados
  if (inicio <= fim) {
    ipcasSelecionados = ipcas.slice(inicio, fim + 1)
  } else {
    ipcasSelecionados = ipcas.slice(fim, inicio + 1)
  }
  console.log('ipcasSelecionados', ipcasSelecionados)
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
  
    const mesesInicioDisponiveis = ipcas.filter(ipca=>ipca.D3C.includes(inicioAno)).length

    const mesesFimDisponiveis = ipcas.filter(ipca=>ipca.D3C.includes(fimAno)).length

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
            <h2
            >
              Valor em{' '}
              <select
                value={inicioMes}
                onChange={(e) => setInicioMes(e.target.value.toString())}
              >
                {mesesOptions.slice(0,mesesInicioDisponiveis)}
              </select>
              de{' '}
              <select
                value={inicioAno}
                onChange={(e) => setInicioAno(e.target.value.toString())}
              >
                {anosOptions}
              </select>
              :
            </h2>
            <p>
              <MoneyInput
                value={valorInicial}
                onChange={(e:any) => setValorInicial(Number(e.target.value))}
                type='number'
              ></MoneyInput>{' '}
            </p>
          </div>

          <div className={styles.card}>
            <h2>
              Valor em {' '}
              <select
                value={fimMes}
                onChange={(e) => setFimMes(e.target.value.toString())}
              >
                {mesesOptions.slice(0,mesesFimDisponiveis)}
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

export default Home
