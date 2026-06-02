#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>
using namespace std;

struct Point{double x; double y;};
// ------------------------------------------------------------
// Створення початкових точок
// ------------------------------------------------------------
vector<Point> createPoints(){
    return{{6.22, -12.02}, {10.35, -7.05}, {15.75, -2.74}, {18.98, 1.67}, {20.04, 7.81}, {29.11, 19.62}};
}
// ------------------------------------------------------------
// Обчислення кроків:
// h_i = x_i - x_(i-1), i = 1, ..., n
// ------------------------------------------------------------
void calculateSteps(const vector<Point>& points, vector<double>& h){
    int n = static_cast<int>(points.size()) - 1;

    for (int i = 1; i <= n; i++){
        h[i] = points[i].x - points[i - 1].x;
    }
}

// ------------------------------------------------------------
// Виведення таблиці кроків h_i
// ------------------------------------------------------------
void printSteps(const vector<double>& h, int n)
{
    cout << "Таблиця кроків h_i:" << endl;
    cout << setw(5) << "i"
        << setw(12) << "h_i" << endl;

    for (int i = 1; i <= n; i++)
    {
        cout << setw(5) << i
            << setw(12) << h[i] << endl;
    }

    cout << endl;
}

// ------------------------------------------------------------
// Обчислення коефіцієнтів трьохдіагональної системи:
// ------------------------------------------------------------
void calculateSystemCoefficients(
    const vector<Point>& points,
    const vector<double>& h,
    vector<double>& u,
    vector<double>& v,
    vector<double>& w,
    vector<double>& F)
{
    int n = static_cast<int>(points.size()) - 1;

    for (int i = 2; i <= n; i++)
    {
        u[i] = h[i];
        v[i] = -2.0 * (h[i - 1] + h[i]);
        w[i] = h[i - 1];

        F[i] = 3.0 *( (points[i].y - points[i - 1].y) / h[i] - (points[i - 1].y - points[i - 2].y) / h[i - 1]);
    }
}

// ------------------------------------------------------------
// Виведення коефіцієнтів системи
// ------------------------------------------------------------
void printSystemCoefficients(
    const vector<double>& u,
    const vector<double>& v,
    const vector<double>& w,
    const vector<double>& F,
    int n)
{
    cout << "Таблиця коефіцієнтів системи:" << endl;

    cout << setw(5) << "i"
        << setw(12) << "w_i"
        << setw(12) << "v_i"
        << setw(12) << "u_i"
        << setw(12) << "F_i" << endl;

    for (int i = 2; i <= n; i++)
    {
        cout << setw(5) << i
            << setw(12) << w[i]
            << setw(12) << v[i]
            << setw(12) << u[i]
            << setw(12) << F[i] << endl;
    }

    cout << endl;
}

// ------------------------------------------------------------
// Виведення трьохдіагональної системи:
// ------------------------------------------------------------
void printSystem(
    const vector<double>& u,
    const vector<double>& v,
    const vector<double>& w,
    const vector<double>& F,
    int n)
{
    cout << "Трьохдіагональна система лінійних рівнянь:" << endl;
    cout << "c1 = 0, c" << n + 1 << " = 0" << endl << endl;

    for (int i = 2; i <= n; i++)
    {
        cout << w[i] << " * c" << i - 1
            << " + " << -v[i] << " * c" << i
            << " + " << u[i] << " * c" << i + 1
            << " = " << F[i] << endl;
    }

    cout << endl;
}

// ------------------------------------------------------------
// Метод прогонки.
// ------------------------------------------------------------
void sweepMethod(
    const vector<double>& u,
    const vector<double>& v,
    const vector<double>& w,
    const vector<double>& F,
    vector<double>& A,
    vector<double>& B,
    vector<double>& c,
    int n)
{
    // Натуральний кубічний сплайн:
    c[1] = 0.0;
    c[n + 1] = 0.0;

    // Прямий хід прогонки
    A[2] = u[2] / v[2];
    B[2] = -F[2] / v[2];

    for (int i = 3; i <= n; i++)
    {
        double denominator = v[i] - w[i] * A[i - 1];

        A[i] = u[i] / denominator;
        B[i] = (w[i] * B[i - 1] - F[i]) / denominator;
    }

    // Зворотний хід прогонки
    for (int i = n; i >= 2; i--){
        c[i] = A[i] * c[i + 1] + B[i];
    }
}

// ------------------------------------------------------------
// Виведення коефіцієнтів прогонки A_i, B_i
// ------------------------------------------------------------
void printSweepCoefficients(
    const vector<double>& A,
    const vector<double>& B,
    int n)
{
    cout << "Коефіцієнти прогонки A_i, B_i:" << endl;

    cout << setw(5) << "i"
        << setw(14) << "A_i"
        << setw(14) << "B_i" << endl;

    for (int i = 2; i <= n; i++)
    {
        cout << setw(5) << i
            << setw(14) << A[i]
            << setw(14) << B[i] << endl;
    }

    cout << endl;
}

// ------------------------------------------------------------
// Виведення коефіцієнтів c_i
// ------------------------------------------------------------
void printC(const vector<double>& c, int n)
{
    cout << "Коефіцієнти c_i:" << endl;

    for (int i = 1; i <= n + 1; i++)
    {
        cout << "c" << i << " = " << c[i] << endl;
    }

    cout << endl;
}

// ------------------------------------------------------------
// Обчислення коефіцієнтів поліномів:
// ------------------------------------------------------------
void calculatePolynomialCoefficients(
    const vector<Point>& points,
    const vector<double>& h,
    const vector<double>& c,
    vector<double>& a,
    vector<double>& b,
    vector<double>& d)
{
    int n = static_cast<int>(points.size()) - 1;

    for (int i = 1; i <= n; i++)
    {
        a[i] = points[i - 1].y;

        b[i] = (points[i].y - points[i - 1].y) / h[i]
            - ((2.0 * c[i] + c[i + 1]) * h[i]) / 3.0;

        d[i] = (c[i + 1] - c[i]) / (3.0 * h[i]);
    }
}

// ------------------------------------------------------------
// Виведення таблиці коефіцієнтів a_i, b_i, c_i, d_i
// ------------------------------------------------------------
void printPolynomialCoefficients(
    const vector<double>& a,
    const vector<double>& b,
    const vector<double>& c,
    const vector<double>& d,
    int n)
{
    cout << "Коефіцієнти поліномів:" << endl;

    cout << setw(5) << "i"
        << setw(14) << "a_i"
        << setw(14) << "b_i"
        << setw(14) << "c_i"
        << setw(14) << "d_i" << endl;

    for (int i = 1; i <= n; i++)
    {
        cout << setw(5) << i
            << setw(14) << a[i]
            << setw(14) << b[i]
            << setw(14) << c[i]
            << setw(14) << d[i] << endl;
    }

    cout << endl;
}

// ------------------------------------------------------------
// Виведення одного доданка полінома з правильним знаком
// ------------------------------------------------------------
void printPolynomialTerm(double coefficient, double x0, int power){
    if (coefficient >= 0){cout << " + " << coefficient;}
    else { cout << " - " << abs(coefficient);}
    cout << " * (x - " << x0 << ")";
    if (power > 1){ cout << "^" << power; }
}

// ------------------------------------------------------------
// Виведення готових функцій сплайна
// ------------------------------------------------------------
void printSplines(
    const vector<Point>& points,
    const vector<double>& a,
    const vector<double>& b,
    const vector<double>& c,
    const vector<double>& d)
{
    int n = static_cast<int>(points.size()) - 1;

    cout << "Результат інтерполяції:" << endl;

    for (int i = 1; i <= n; i++)
    {
        cout << "phi" << i << "(x) = " << a[i];

        printPolynomialTerm(b[i], points[i - 1].x, 1);
        printPolynomialTerm(c[i], points[i - 1].x, 2);
        printPolynomialTerm(d[i], points[i - 1].x, 3);

        cout << ",  x належить ["
            << points[i - 1].x << "; "
            << points[i].x << "]" << endl;
    }

    cout << endl;
}
// ------------------------------------------------------------
// Обчислення значення i-го полінома у точці x
// ------------------------------------------------------------
double calculateSplineValue(
    double x,
    int i,
    const vector<Point>& points,
    const vector<double>& a,
    const vector<double>& b,
    const vector<double>& c,
    const vector<double>& d)
{
    double t = x - points[i - 1].x;

    return a[i]
        + b[i] * t
        + c[i] * t * t
        + d[i] * t * t * t;
}

// ------------------------------------------------------------
// Обчислення першої похідної i-го полінома
// ------------------------------------------------------------
double calculateFirstDerivative(
    double x,
    int i,
    const vector<Point>& points,
    const vector<double>& b,
    const vector<double>& c,
    const vector<double>& d)
{
    double t = x - points[i - 1].x;

    return b[i]
        + 2.0 * c[i] * t
        + 3.0 * d[i] * t * t;
}

// ------------------------------------------------------------
// Обчислення другої похідної i-го полінома
// ------------------------------------------------------------
double calculateSecondDerivative(
    double x,
    int i,
    const vector<Point>& points,
    const vector<double>& c,
    const vector<double>& d)
{
    double t = x - points[i - 1].x;

    return 2.0 * c[i]
        + 6.0 * d[i] * t;
}

// ------------------------------------------------------------
// Перевірка проходження сплайна через задані вузли
// ------------------------------------------------------------
void checkNodes(
    const vector<Point>& points,
    const vector<double>& a,
    const vector<double>& b,
    const vector<double>& c,
    const vector<double>& d)
{
    int n = static_cast<int>(points.size()) - 1;

    cout << "Перевірка проходження сплайна через вузли:" << endl;

    for (int i = 1; i <= n; i++)
    {
        double leftValue = calculateSplineValue(
            points[i - 1].x, i, points, a, b, c, d);

        double rightValue = calculateSplineValue(
            points[i].x, i, points, a, b, c, d);

        cout << "phi" << i << "(" << points[i - 1].x << ") = "
            << leftValue
            << ",  phi" << i << "(" << points[i].x << ") = "
            << rightValue << endl;
    }

    cout << endl;
}

// ------------------------------------------------------------
// Перевірка гладкості сплайна:
// у внутрішніх вузлах повинні збігатися перші та другі похідні сусідніх поліномів
// ------------------------------------------------------------
void checkSmoothness(
    const vector<Point>& points,
    const vector<double>& b,
    const vector<double>& c,
    const vector<double>& d)
{
    int n = static_cast<int>(points.size()) - 1;

    cout << "Перевірка гладкості у внутрішніх вузлах:" << endl;

    for (int i = 1; i < n; i++)
    {
        double x = points[i].x;

        double firstLeft =
            calculateFirstDerivative(x, i, points, b, c, d);

        double firstRight =
            calculateFirstDerivative(x, i + 1, points, b, c, d);

        double secondLeft =
            calculateSecondDerivative(x, i, points, c, d);

        double secondRight =
            calculateSecondDerivative(x, i + 1, points, c, d);

        cout << "x = " << x << endl;

        cout << "phi" << i << "'(x) = " << firstLeft
            << ",  phi" << i + 1 << "'(x) = " << firstRight << endl;

        cout << "phi" << i << "''(x) = " << secondLeft
            << ",  phi" << i + 1 << "''(x) = " << secondRight << endl;

        cout << endl;
    }
}
// ------------------------------------------------------------
// Основна функція виконання інтерполяції.
// У ній викликаються всі етапи алгоритму.
// ------------------------------------------------------------
void performSplineInterpolation(const vector<Point>& points){
    int n = static_cast<int>(points.size()) - 1;

    vector<double> h(n + 1, 0.0);

    vector<double> u(n + 1, 0.0);
    vector<double> v(n + 1, 0.0);
    vector<double> w(n + 1, 0.0);
    vector<double> F(n + 1, 0.0);

    vector<double> A(n + 1, 0.0);
    vector<double> B(n + 1, 0.0);

    vector<double> a(n + 1, 0.0);
    vector<double> b(n + 1, 0.0);
    vector<double> c(n + 2, 0.0);
    vector<double> d(n + 1, 0.0);

    calculateSteps(points, h);
    printSteps(h, n);

    calculateSystemCoefficients(points, h, u, v, w, F);
    printSystemCoefficients(u, v, w, F, n);
    printSystem(u, v, w, F, n);

    sweepMethod(u, v, w, F, A, B, c, n);
    printSweepCoefficients(A, B, n);
    printC(c, n);

    calculatePolynomialCoefficients(points, h, c, a, b, d);
    printPolynomialCoefficients(a, b, c, d, n);
    printSplines(points, a, b, c, d);

    checkNodes(points, a, b, c, d);
    checkSmoothness(points, b, c, d);
}

// Головна функція програми.
int main(){
    cout << fixed << setprecision(4);
    vector<Point> points = createPoints();
    performSplineInterpolation(points);

}
