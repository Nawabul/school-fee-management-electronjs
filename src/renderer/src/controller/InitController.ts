class InitController {
  async database(): Promise<boolean> {
    const result = await window.init.database()

    if (!result.success) {
      return false
    }
    return true
  }
  async monthly_fee(): Promise<boolean> {
    const result = await window.init.monthly_fee()

    if (!result.success) {
      return false
    }
    return true
  }

  async is_dark_mode(): Promise<boolean> {
    const result = await window.init.is_dark_mode()

    if (!result.success) {
      return false
    }
    return result.data
  }

  // check updte
  async app_update(): Promise<boolean> {
    await window.init.app_update()

    return true
  }
}

export default new InitController()
