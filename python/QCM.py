class QCM:
    def init(self, q, r1, r2, r3, r4, s):
        self.q = q
        self.r1 = r1
        self.r2 = r2
        self.r3 = r3
        self.r4 = r4
        self.s = s
        self.p = 0

    def print_info(self):
        print(self.q)
        print("\nSaisir la bonne réponse")

        x = input(f"a - {self.r1}, b - {self.r2}, c - {self.r3}, d - {self.r4}, stop pour arrêter : ")

        while x not in ["a", "b", "c", "d", "stop", ""]:
            print("\nRéponse invalide. Réessayez.")
            x = input(f"\na - {self.r1}, b - {self.r2}, c - {self.r3}, d - {self.r4}, stop pour arrêter : ")

        if x == "a":
            chosen = self.r1
        elif x == "b":
            chosen = self.r2
        elif x == "c":
            chosen = self.r3
        elif x == "d":
            chosen = self.r4
        else:
            chosen = ""

        if chosen == self.s:
            print("\n》》》Correct!")
            self.p = 1
        elif (chosen == ""):
            print("Ok")
            self.p = 0
        else:
            print("\n》》》Incorrect!")
            print(f"La bonne réponse est: {self.s}")
            self.p = 0




def ajouter_qcms(T):
    q = input("entrer la question souhaitée:")
    r1 = input("la réponse 1:")
    r2 = input("la réponse 2:")
    r3 = input("la réponse 3:")
    r4 = input("la réponse 4:")
    s = input("la solution est (r1,r2,r3,r4):")
    while s not in ["r1","r2","r3","r4"]:
        print("répète")
        s = input("la solution est (r1,r2,r3,r4):")

    if (s == "r1"):
        s = r1
    elif (s == "r2"):
        s = r2
    elif (s == "r3"):
        s = r3
    elif (s == "r4"):
        s = r4

    qn = QCM(q, r1, r2, r3, r4, s)
    T.append(qn)
q1 = QCM("4 + 7 =", "4", "10", "11", "9", "11")
q2 = QCM("4 × 3 =", "4", "12", "21", "3", "12")
q3 = QCM("f(x) = X²; f(2) = ", "4", "-4", "2", "3", "4")
q4 = QCM("la fonction f(x) = x½ est défini sur ", "R", "[0,+infinie[", "]0,+infinie[", "]-infinie,0]", "[0,+infinie[")
q5 = QCM("lim(x——>infinie) lnx/x =", "infinie", "0", "1", "n'existe pas", "0")
q6 = QCM("la série de U(n) = 1/n²", "converge", "divergent", "#", "#", "convergence")



L = [q1,q2,q3,q4,q5,q6]

print("Bonjour sur le programme de QCM\n")

z = False
if z == True:
    y = input("voulait vous ajouter un qcm?")
    while y not in ["no",""]:
        ajouter_qcms(L)
        y = input("voulait vous ajouter un qcm?")

point = 0
n = 1
for I in L:
    print(f"◇ la question n°{n}\n")
    I.print_info()
    print("\n")
    point += I.p
    n += 1

print(f"Votre Score est : {point} / {len(L)}")