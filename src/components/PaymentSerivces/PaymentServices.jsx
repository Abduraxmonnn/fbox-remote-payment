import './PaymentServices.scss'

const PaymentServices = () => {

    return (
        <section className='service-main'>
            <h1>Добро пожаловать!</h1>
            <div className="service-content">
                <ul>
                    <li>
                        <button className='service-button'>
                            PayMe
                        </button>
                    </li>
                    <li>
                        <button className='service-button'>
                            Click
                        </button>
                    </li>
                    <li>
                        <button className='service-button'>
                            Uzum
                        </button>
                    </li>
                    <li>
                        <button className='service-button'>
                            Anor
                        </button>
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default PaymentServices;