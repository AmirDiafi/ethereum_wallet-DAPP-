import './App.css'
import Web3 from 'web3'
import { useEffect, useState } from 'react'
import DaiTokenApis from './abis/DaiTokenAbis.json'
import dai_logo from './dai-logo.png'

function App() {
	const [balance, setBalance] = useState(null)
	const [tokenMock, setTokenMock] = useState(null)
	const [recepient, setRecepient] = useState('')
	const [amount, setAmount] = useState(null)
	const [accounts, setAccounts] = useState([])

	useEffect(() => {
		enableWeb3()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Load web3 and the contract artifact
	const enableWeb3 = () => {
		if (window.ethereum) {
			window.ethereum
				.enable()
				.then(() => {
					const web3 = new Web3(window.ethereum)
					console.log(web3)
					loadBlockchainData()
				})
				.catch(() => {
					console.log('User denied account access')
				})
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			console.log('from wondow.web3', window.web3)
			loadBlockchainData()
		} else {
			window.alert(
				'Non-Ethereum browser detected. You should consider trying MetaMask!'
			)
		}
	}

	// Load blockchain data from the contract
	const loadBlockchainData = async () => {
		const web3 = new Web3(window.ethereum)
		const accounts = await web3.eth.getAccounts()
		setAccounts(accounts)
		// Change yo your Dai Token Address and do not forgot to change the Dai Token json you can get it from here: https://etherscan.io/address/0x6b175474e89094c44da98b954eedeac495271d0f#code
		const daiTokenAddress = '0x7b729B07EcBDEd8879Acf997aAF6546926982830'
		const daiToken = new web3.eth.Contract(DaiTokenApis.abi, daiTokenAddress)
		setTokenMock(daiToken)
		const balance = await daiToken.methods.balanceOf(accounts[0]).call()
		setBalance(web3.utils.fromWei(balance, 'ether'))
	}

	const transferEth = async () => {
		try {
			const web3 = new Web3(window.ethereum)
			const the_amount = web3.utils.toWei(amount, 'ether')
			console.log('amount', the_amount)
			console.log('recepient', recepient)
			tokenMock.methods.transfer(recepient, the_amount).send({
				from: accounts[0],
			})
		} catch (error) {
			console.log('error', error)
		}
	}

	return (
		<div className='App'>
			<header className='App-header'>
				<img width={120} alt='daicoinn' src={dai_logo} />
				<h1>{balance} DAI</h1>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						transferEth()
					}}
				>
					<input
						onChange={(event) => {
							setRecepient(event.target.value)
						}}
						placeholder='Recepient address'
						type='text'
					/>
					<br />
					<input
						onChange={(event) => {
							setAmount(event.target.value)
						}}
						placeholder='Amount'
						type='number'
					/>
					<br />
					<button type='submit'>Send</button>
				</form>
			</header>
		</div>
	)
}

export default App
