import { Between, FindOperator } from 'typeorm'

interface IbetweenPaymentId {
  rental: {
    payments: {
      payment_id: FindOperator<number>
    }
  }
}

export const betweenPaymentId = (min: number, max: number): IbetweenPaymentId => {
  return {
    rental: {
      payments: { payment_id: Between(min, max) }
    }
  }
}
