#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int n1,n2,n3,N,m;
int cardp,carda,cardc;
float card;
float p1,p2,p3,p4,p5,p6;
int choix;

/fonction du factoriel n!/
int factoriel(int n){
    int f = 1;
    if (n <= 0){
        int f = 1;
    }else{
        for (int i = 1; i <= n; i++){
            f = i;
        }
    }
    return f;
}

/fonction de la puissance n^k/
int puissance(int n,int k){
    int p = pow(n,k);
    return p;
}

/fonction de l'arrangement n!/(n-k)!/
int arrangement(int n,int k){
    int a1 = factoriel(n);
    int a2 = factoriel(n-k);
    int a = a1 / a2;
    return a;
}

/fonction de combinaison (n k) = n!/k!(n-k)!*/
int combinaison(int n,int k){
    int c1 = arrangement(n,k);
    int c2 = factoriel(k);
    int c = c1/c2;
    return c;
}
int main() {
    printf("● On considère une bouteille contenant :\n\n");
    printf("》n1 boules rouge\n》n2 boules verte\n》n3 boules bleu\n》N = n1+n2+n3 nombre total des boules\n");
    printf("\n############\n\n");

    printf("saisir le nombre de boules rouge n1 :");
    scanf("%d",&n1);
    printf("saisir le nombre de boules verte n2 :");
    scanf("%d",&n2);
    printf("saisir le nombre de boules bleu n3 :");
    scanf("%d",&n3);
    N = n1 + n2 + n3;

    printf("saisir le nombre de tires m <= N ; N = %d :",N);
    scanf("%d",&m);
    while(m > N || m < 0){
        printf("saisir le nombre de tires 0 < m <= N ; N %d :",N);
        scanf("%d",&m);
    }

    printf("\n############\n\n");
    printf("● On considère les événements suivants:\n\n");
    printf("▪︎A :'la probabilité de tirer seulement des boules rouge'\n\n");
    printf("▪︎B :'la probabilité de tirer seulement des boules verte'\n\n");
    printf("▪︎C :'la probabilité de tirer seulement des boules bleu'\n\n");
    printf("▪︎D :'la probabilité de tirer seulement des boules rouge ou verte'\n\n");
    printf("▪︎E :'la probabilité de tirer seulement des boules rouge ou bleu'\n\n");
    printf("▪︎F :'la probabilité de tirer seulement des boules verte ou bleu'\n");

    /le cardinal des événements certains/
    cardp = puissance(N,m);
    carda = arrangement(N,m);
    cardc = combinaison(N,m);

    printf("\n############\n\n");
    printf("saisir le choix de la tire par: 1- puissance, 2- arrangement, 3- combinaison : ");
    scanf("%d",&choix);
    while((choix != 1) && (choix != 2) && (choix != 3)){
        printf("saisir le choix de la tire par: 1- puissance, 2- arrangement, 3- combinaison : ");
        scanf("%d",&choix);
    }
    if (choix == 1){
        card = puissance(n1,m);
        p1 = card/cardp;

        card = puissance(n2,m);
        p2 = card/cardp;

        card = puissance(n3,m);
        p3 = card/cardp;

        card = puissance(n1+n2,m);
        p4 = card/cardp;

        card = puissance(n1+n3,m);
        p5 = card/cardp;

        card = puissance(n2+n3,m);
        p6 = card/cardp;
    }else{
        if (choix == 2){
            if (n1 >= m){
                card = arrangement(n1,m);
            }else{
                card = 0;
            }
            p1 = card/cardp;

            if (n2 >= m){
                card = arrangement(n2,m);
            }else{
                card = 0;
            }
            p2 = card/cardp;

            if (n3 >= m){
                card = arrangement(n3,m);
            }else{
                card = 0;
            }
            p3 = card/cardp;

            if (n1+n2 >= m){
                card = arrangement(n1+n2,m);
            }else{
                card = 0;
            }
            p4 = card/cardp;

            if (n1+n3 >= m){
                card = arrangement(n1+n3,m);
            }else{
                card = 0;
            }
            p5 = card/cardp;

            if (n2+n3 >= m){
                card = arrangement(n2+n3,m);
            }else{
                card = 0;
            }
            p6 = card/cardp;
}else{
                card = 0;
            }
            p3 = card/cardp;

            if (n1+n2 >= m){
                card = combinaison(n1+n2,m);
            }else{
                card = 0;
            }
            p4 = card/cardp;

            if (n1+n3 >= m){
                card = combinaison(n1+n3,m);
            }else{
                card = 0;
            }
            p5 = card/cardp;

            if (n2+n3 >= m){
                card = combinaison(n2+n3,m);
            }else{
                card = 0;
            }
            p6 = card/cardp;
        }
    }
    printf("\n############\n\n");
    printf("》Voici les probabilité suivante :\n");
    printf("◇ p(A) = %f\n",p1);
    printf("◇ p(B) = %f\n",p2);
    printf("◇ p(C) = %f\n",p3);
    printf("◇ p(D) = %f\n",p4);
    printf("◇ p(E) = %f\n",p5);
    printf("◇ p(F) = %f\n",p6);

    return 0;
}