import { PaymentChart, statics } from '@type/interfaces/dashboard'

class DashboardController {
  async statics(): Promise<statics> {
    const result = await window.dashboard.statics()
    const defaultValues: statics = {
      total_advance: 0,
      active_advance: 0,
      active_due: 0,
      total_due: 0,
      total_class: 0,
      total_student: 0,
      active_student: 0,
      total_item: 0
    }
    if (!result.success) {
      return defaultValues
    }
    return result.data
  }

  // payment chart

  async paymentChart(): Promise<PaymentChart[]> {
    const result = await window.dashboard.payment_chart()

    if (!result.success) {
      return []
    }
    return result.data
  }
}

export default new DashboardController()
