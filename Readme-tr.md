This project forked on https://github.com/wpcodevo/jwt_authentication_authorization_node


# Dizin ve Dosya Yapısı

Proje içerisindeki *base-core* gibi yapısal özellikte olmayan *business* işlemler için kullanılan bütün dosyalar hiyerarşik olarak **modules** dizini içerisinde bulunur.

> src
  > middleware        -- bütün request ve response istekleri için ortak olan sınıflar buradadır
  > models            -- projenin base-core işlemleri için kullanılacak model sınıfları buradadır
  > modules           -- projenin business katmanı için kullanılan bütün dosyalar buradadır
    > administration
      > user          -- user işlemleri gerekli bütün dosyalar bu dizindedir. *user.model.ts*, *user.controller.ts*, *user.route.ts*, *user.schema.ts*, *user.service.ts*
  > utils             -- projenin base-core işlemleri için kullanılacak sınıflar buradadır
    > errors          -- özel hata sınıfları bu dizindedir 
  

# Route Standartları
Route sınıfları için 


# Controller Standartları


# Service Standartları

* Servis sınıfları isimledirilirken ilgili modül-ekran-tablo isimleri kullanılır. Örneğin *user* API ucu için: *user.service.ts*
* Servis metodları *primitive* tip yada *...RequestDto* tipinde parametreler alır. *Request* parametresi almaz 

# Model Standartları

* Model sını

# Schema Standartları


# Yeni Endpoint Ekleme Adımları

* Yeni bir *endpoint* için *modules* dizininde uygun dizine eklenmesi gereken dosyalar şunlardır: *...model.ts*, *...route.ts*, *...controller.ts*, *.../service.ts*, *...scheme.ts*

* *app.ts* içerisine ilgili *endpoint* adresi eklenir
````typescript
// app.ts
app.use('/api/user', userRouter);
````

* Her bir tablo/ekran için *OpeAPI* standartlarına uygun olarak *get-post-put-delete* metodları eklenir
* *userRouter* tanımlaması yapılır
````typescript
// user.route.ts
const router = express.Router();    
router.use(deserializeUser, requireUser);       // middleware içerisinde gelen bütün isteklerin içerisine User bilgisi eklenir 
router.get('/:id', getUserHandler);             // OpenAPI path tanımlarından get endpointi eklenir
router.put('/', validation(insertUserSchema), insertUserHandler);             // OpenAPI path tanımlarından put endpointi eklenir
router.post('/:userId', updateUserHandler);     // OpenAPI path tanımlarından post endpointi eklenir
router.delete('/:userId', deleteUserHandler);   // OpenAPI path tanımlarından delete endpointi eklenir
````
* Bu aşamada model validasyonları yapılabilir *validation(insertUserSchema)*

* Liste-rapor API istekleri için ayrı bir *endpoint* tanımlanabilir
````typescript
// users.route.ts
app.use('/api/users', userRouter);
````

* controller dosyaları içerisine ilgili *handler* fonksiyonları yazılır
````typescript
// user.controller.ts
export const getUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findUserById(req.params.id);
    res.status(200).json({
      status: StatusCode.Success,
      data: user,
    });
  } catch (err: any) {
    next(err);
  }
};
````
* Controller metodları içerisinde ayrı business validasyon işlemleri yapılabilir
* Servis dosyası ve sınıfları eklenir
````typescript
// user.service.ts
export const excludedFields = ['password'];

export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean();
  return omit(user, excludedFields);
};
````

# Validation
Validayon işlemleri bir kaç aşamada yapılabilir. İlk validasyon *Request* içerisindeki verinin kontrolü için *middleware* de tanımlı *validate* ve *schema* sınıfları ile *route* içerisinde yapılır. *Schema* validasyonu için *zod* paketi kullanılmaktadır. İkinci validasyon ise *controller* sınıfları içerisinde yapılır.  

## 1- Schema Validation
````typescript
// auth.route.ts
router.post('/register', validate(createUserSchema), registerHandler);

// user.schema.ts
export const createUserSchema = object({
  body: object({
    name: string({ required_error: 'Name is required' }),
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email'
    ),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  }),
});
````

## 2- Business Validation

İş kuralları ve mantıksal kuralların yapıldığı validasyon şeklidir ve *controller* dosyarındaki *handler* metodlarında yapılır. Öreğin kayıt-kullanıcı mevcut kontrolü, iş kurallarına uygun olmayan ilişkilsel değerler vb.

````typescript
// auth.controller.ts
export const loginHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the collection
    const user = await findUser({ email: req.body.email });
    
    // Check if user exist and password is correct
    if (
      !user ||
      !(await user.comparePasswords(user.password, req.body.password))
    ) {
      return next(new AppError('Invalid email or password', 401));
    }

    // ...
}};
````

# Error Handling

Hata yönetim işlemleri 