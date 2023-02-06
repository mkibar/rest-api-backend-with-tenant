This project forked on https://github.com/wpcodevo/jwt_authentication_authorization_node


# Dizin ve Dosya Yapısı

Proje içerisindeki *base-core-template* gibi yapısal özellikte olmayan *business* işlemler için kullanılan bütün dosyalar hiyerarşik olarak **modules** dizini içerisinde bulunur.

> src
  > middleware            -- bütün request ve response istekleri için ortak olan sınıflar buradadır
  > models                -- projenin genel-temel işlemleri için kullanılacak model sınıfları ve enum sınıfları buradadır
  > modules               -- projenin business katmanı için kullanılan bütün dosyalar buradadır
    > _auth               -- Login işlemleri buradadır
    > administration      -- tenant, kullanıcı, rol ve yetki gibi yapısal modüller buradadır
      > permission        -- yetkilendirme işlemleri
      > role              -- rol işlemleri
      > tenant            -- kiracı (tenant) işlemleri
      > user              -- user işlemleri gerekli bütün dosyalar bu dizindedir. *user.model.ts*, *user.controller.ts*, *user.route.ts*, *user.schema.ts*, *user.service.ts*
      > userrole          -- kullanıcı rol işlemleri
    > common              -- yapısal olmayan genel modüller buradadır
      > organizationunit  -- organizasyon ağacının modülüdür. Uygun olan diğer modüller child olarak *organizationunit*e bağlanır
    > elecricity          -- enerji modülüdür. Kompanzasyon, enerji üretim, enerji tüketim modüllerini barındırır
  > utils                 -- projenin base-core işlemleri için kullanılacak sınıflar ile helper sınıfları buradadır
    > errors              -- özel hata sınıfları bu dizindedir 
> config                  -- static değerler ve config parametreleri buradadır

# app.ts Sınıfı
Projenin başlangıç noktası olan *app.ts* sınıfı gerekli yapılandırma, middleware ve route işlemlerini tanımlar.

# Route Standartları
Route sınıflarının her biri ayrı bir dizin içerisinde değil ilgili oldukları *module* içerisine eklenmişlerdir. 
* *[moduleName].route.ts* olarak isimlendirilirler
* Her bir *route* sınıfı *app.ts* içerisinde belirtilir 
* Route sınıfları içerisinde *OpenApi* standartlarına uygun olarak her bir modül (ekran) için *Get*, *Post*, *Put* ve *Delete* uçnoktaları bulunur

````typescript
// tenant.route.ts  (tenantRouter)
router.get('/list', getListTenantsHandler);
router.get('/:id', getTenantHandler);
router.put('/', validate(createTenantSchema), insertTenantHandler);
router.post('/:tenantId', updateTenantHandler);
router.delete('/:tenantId', deleteTenantHandler);
````

*Route* adreslerini projeye tanıtmak için *app.ts* içerisine şe şekilde eklenir.
````typescript
// app.ts
app.use('/api/tenant', tenantRouter);
````

## Route Schema Standartları
Aşağıda *Schema Standartları* başlığı altında detaylandırılmıştır.

## Route Swagger Standartları
Api dokümantasyonu için *Swagger* tercih edilmiştir. Her bir *route* dosyası içerisindeki metodun üst kısmına *swagger* standartlarında Api tanımlaması yapılmalıdır. Bu, gerek Api'nin test edilmesi ve gerekse sunulduğu yerde kolay kullanılabilmesi amacıyla gereklidir.
* Projedeki *Swagger* yapılandırması, bir *swagger.json* dosyası üzrinden değil, parametre ile yapılandırma yöntemi ile kullanılmaktadır
* Eklenen *route* metodları için örnek yapılandırma ayarları *user.route.ts* içerisindeki yapı kullanılarak çoğaltılabilir

Yeni bir *route* sınıfı eklendiğinde *app.ts* dosyasına ilgili tanımlama yapılmalıdır.
````typescript
// app.ts
const swaggerOptions = {    // swagger options
  definition: {
    openapi: "3.0.1",
    info: {
      title: "REST API for Swagger Documentation",
      version: "1.0.0",
    },
    schemes: ["http", "https"],
    servers: [{ url: `http://localhost:${port}/` }],
  },
  apis: [
    `${__dirname}/modules/administration/user/user.route.ts`,
    // Yeni eklenen route dosyası buraya tanımlanmalıdır 
  ],
};
````

# Controller Standartları
*Controller* dosyaları *Schema* kontrolünü (validation) geçen isteklerin ayıklandığı (handle) ve servis sınıflarından gelen verilere göre dönüş değerlerinin-modellerinin hazırlandığı metodları bulundurur. 
* Her bir *Api* isteği için ayrı bir *handle* metodu yazılmalıdır.
* *Controller* dosyalarının içerisinde *business* kontroller (validation) yapılabilir.

````typescript
// auth.controller.ts
export const loginHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUser({ email: req.body.email });   // Get the user from the collection

    if (!user || !(await user.comparePasswords(user.password, req.body.password))) {  // Check if user exist and password is correct
      return next(new AppError('Invalid email or password', 401));
    }
  // ...

  } catch (err: any) {
    next(err);
  }
};
````

Normal şekilde cevap dönecek bir *controller* metodu şu şekildedir.
````typescript
// tenant.controller.ts
export const getTenantHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tenant = await findTenantById(req.params.id);   // servis sınıfından veriyi al
        // dönüş modelini oluştur
        res.status(200).json({
            status: StatusCode.Success,
            data: tenant,
        });
    } catch (err: any) {
        next(err);
    }
};
````

# Service Standartları
Proje içerisindeki *business* işlemlerin yapıldığı sınıflardır. Her servis dosyası ilgili olduğu modül dizini içerisinde bulunur. 

* Servis sınıfları isimledirilirken ilgili modül-ekran-tablo isimleri kullanılır. Örneğin *user* API ucu için: *user.service.ts*
* Servis metodları *primitive* tip yada *...RequestDto* tipinde parametreler alır. *Request* parametresi almaz 
* Hata durumlarında *Exception* fırlatılabilir
* Servis dosyaları içerisinde bir çok alt metod bulunabilir
* Tanımlı bir model yada Dto dönmesi beklenir

# Model Standartları
Model sınıfları proje içerisinde her bir *module* dizininin altında bulunur ve ilgili modüle ait *MonfoDb* veri tabanı şemasını ifade eder. Model sınıfları ve alanlar *decorator* sınıfları ile yapılandırlır. 


# Schema Standartları
Schema dosyaları *Api Endpoint* isteklerinin standartlarını belirleyen ve ilk validasyon işlemlerinin yapıldığı yapılandırma dosyalarıdır. *Schema* yönetimi *zod* paketi ile yönetilmektedir. *body*, *query* ve *params* ile gelen değerlerin-parametrelerin istenen modele uygun olup olmadığının kontrolü yapılır.
* Zorunlu parametre içerecek *endpoint*ler için *schema* tanımlaması yapılmalıdır
* *schema* sınıfları modül içerisine eklenmelidir 
* *[moduleName].schema.ts* olarak isimlendirilmelidirler

````typescript
// user.schema.ts
import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    name: string({ required_error: 'Name is required' }),
    tenant: string({ required_error: 'Tenant is required' }),
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

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
````

* Tanımlanan *schema* ilgili *route* sınıfı içerisinde *middleware* içerisinde bulunan *validate* metodu ile kontrol edilmelidir 
````typescript
// user.route.ts
router.put('/', validate(createUserSchema), insertUserHandler);
````


# Yeni Endpoint Ekleme Adımları

* Yeni bir *endpoint* için *modules* dizininde uygun dizine eklenmesi gereken dosyalar şunlardır: *...model.ts*, *...route.ts*, *...controller.ts*, *.../service.ts*, *...scheme.ts*

* *modules* dizini altındaki üst modüle içerisine eklenecek yeni modüle ait dizin oluşturulur 
* *app.ts* içerisine ilgili *endpoint* adresi eklenir

````typescript
// app.ts
app.use('/api/user', userRouter);
````

* *Router* tanımlaması yapılır ve *route* dosyasına her bir tablo/ekran için *OpeAPI* standartlarına uygun olarak *get-post-put-delete* metodları eklenir

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

* Liste-rapor API istekleri için ayrı bir *endpoint* tanımlanabilir. 
* *get* türünde olan bu liste endpointleri parametre almayan diğer endpointlerden önce yazılmalıdır.
````typescript
// users.route.ts
router.get('/query', restrictTo('admin'), getAllUsersHandler);
router.get('/:id', getUserHandler);
````

* controller dosyaları içerisine ilgili *handler* fonksiyonları yazılır
* Controller metodları içerisinde ayrı business validasyon işlemleri yapılabilir
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
Detayları yukarıda anlatılmıştır.

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