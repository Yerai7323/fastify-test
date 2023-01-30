import { Between, FindOperator, LessThan, MoreThan } from 'typeorm'

interface IbetweenPaymentId {
  rental: {
    payments: {
      payment_id: FindOperator<number>
    }
  }
}

interface Idates {
  rental_date: FindOperator<Date>
}

export const betweenPaymentId = (min: number, max: number): IbetweenPaymentId => {
  return {
    rental: {
      payments: { payment_id: Between(min, max) }
    }
  }
}

export const dates = (fromDate: Date, toDate: Date): Idates | {} => {
  if (fromDate !== undefined && toDate !== undefined) {
    return {
      rental_date: Between(fromDate, toDate)
    }
  } else if (fromDate !== undefined) {
    return {
      rental_date: MoreThan(fromDate)
    }
  } else if (toDate !== undefined) {
    return {
      rental_date: LessThan(toDate)
    }
  } else {
    return {}
  }
}
