export const useAuth = () => {
  const confirmationToken = ref<string | null>()
  const authState = useState<AuthState>('auth', () => ({
    user: null,
    isAuthenticated: false,
    isFetched: false,
    checkpoint: {
      authType: undefined,
    },
  }))

  const setUser = (user: FullUser) => {
    authState.value.user = user
    authState.value.isFetched = true
    authState.value.isAuthenticated = true
    authState.value.checkpoint.authType = undefined
  }

  const parseErrors = (error: any): ApiError =>
    error?.response?._data?.errors ||
    error?.data?.errors ||
    error?.errors || [
      error?.data?.statusMessage ||
        error?.statusMessage ||
        '请求失败，请稍后重试',
    ]

  const login = async (user: string, password: string, captcha: string) => {
    try {
      const data: {
        user?: FullUser | null
        type?: AuthType | null
        token?: string | null
        errors?: ApiError | null
      } = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          user,
          password,
          captcha,
        },
      })
      if (data.type == 'two_factor_required') {
        // [INFO] send user to 2fa checkpoint
        authState.value.checkpoint.authType = 'two_factor_required'
        confirmationToken.value = data.token
        return
      }
      if (data?.user) {
        // [INFO] user completed authentication
        authState.value.checkpoint.authType = 'completed'
        setUser(data.user)

        await navigateTo('/app')
      } else {
        throw data
      }
    } catch (error: any) {
      throw parseErrors(error)
    }
  }

  const checkpoint = async (code: number | string) => {
    try {
      const data: { user?: FullUser | null; errors?: ApiError } = await $fetch(
        '/api/auth/login/checkpoint',
        {
          method: 'POST',
          body: {
            code,
            confirmation_token: confirmationToken.value,
          },
        }
      )
      if (data?.user) {
        // [INFO] user completed authentication
        authState.value.checkpoint.authType = 'completed'
        confirmationToken.value = null
        setUser(data.user)

        await navigateTo('/app')
      } else {
        throw data
      }
    } catch (error: any) {
      throw parseErrors(error)
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    captcha: string,
    verificationToken: string
  ) => {
    try {
      const data: { user?: FullUser; errors?: ApiError } = await $fetch(
        '/_falixer-auth/register',
        {
          method: 'POST',
          body: {
            name,
            email,
            password,
            captcha,
            verification_token: verificationToken,
          },
        }
      )

      if (data.user) {
        authState.value.checkpoint.authType = 'completed'
        setUser(data.user)
        await navigateTo('/auth/verify')
      } else {
        throw data
      }
    } catch (error: any) {
      throw parseErrors(error)
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/user/logout', {
        method: 'POST',
      })

      authState.value.user = null
      authState.value.isAuthenticated = false
      authState.value.checkpoint.authType = undefined

      await navigateTo('/')
    } catch (error) {
      throw error
    }
  }

  const initializeAuth = async () => {
    try {
      const data: { user: FullUser } = await $fetch('/api/user', {
        method: 'GET',
      })

      setUser(data.user)
    } catch {
      authState.value.isAuthenticated = false
      authState.value.isFetched = true
    }
  }

  return {
    user: readonly(computed(() => authState.value.user)),
    isAuthenticated: readonly(computed(() => authState.value.isAuthenticated)),
    isFetched: readonly(computed(() => authState.value.isFetched)),
    checkpointData: readonly(computed(() => authState.value.checkpoint)),

    login,
    checkpoint,
    register,
    logout,
    initializeAuth,
    setUser,
  }
}
